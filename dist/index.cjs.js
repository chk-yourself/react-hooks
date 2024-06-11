'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

function useIsFirstRender() {
    const isFirstRender = react.useRef(true);
    react.useEffect(() => {
        isFirstRender.current = false;
    }, []);
    return isFirstRender.current;
}

/**
 * Custom hook to detect clicks outside a specified element.
 * Optionally accepts an existing ref as a parameter to allow better composition
 * with other hooks or components that may also need to manage the same ref
 *
 * @param callback - Function to call when a click outside is detected.
 * @param externalRef - Optional external ref to use instead of the internal one.
 * @returns A ref object to be assigned to the element to be monitored.
 */
function useClickOutside(callback, externalRef) {
    // Create an internal ref if no external ref is provided
    const internalRef = react.useRef(null);
    // Use the external ref if provided, otherwise use the internal ref
    const ref = externalRef || internalRef;
    react.useEffect(() => {
        // Handler function to be called on document click
        const handleClickOutside = (e) => {
            // Check if the click is outside the ref element
            if (ref.current && !ref.current.contains(e.target)) {
                // If so, call the callback function
                callback(e);
            }
        };
        // Add the event listener for mousedown events
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup the event listener on component unmount or when dependencies change
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [callback, ref]); // Re-run the effect only if callback or ref changes
    // Return the ref object to be used by the component
    return ref;
}

/**
 * Custom hook to sync state with localStorage.
 *
 * @param key - The key under which the value is stored in localStorage.
 * @param initialValue - The initial value to use if no value is found in localStorage.
 * @returns A stateful value and a function to update it.
 */
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = react.useState(() => {
        // Fallback for SSR
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = react.useCallback((value) => {
        try {
            // Fallback for SSR
            if (typeof window === 'undefined') {
                console.warn('Attempted to use localStorage in a non-browser environment');
                return;
            }
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);
    // Listen for storage changes (from other tabs/windows)
    react.useEffect(() => {
        // Fallback for SSR
        if (typeof window === 'undefined') {
            return;
        }
        const handleStorageChange = (event) => {
            if (event.key === key) {
                try {
                    setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
                }
                catch (error) {
                    console.error(error);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);
    return [storedValue, setValue];
}

function useFocus() {
    const ref = react.useRef(null);
    const [isFocused, setIsFocused] = react.useState(false);
    const handleFocus = react.useCallback(() => setIsFocused(true), []);
    const handleBlur = react.useCallback(() => setIsFocused(false), []);
    const refCallback = react.useCallback((node) => {
        if (ref.current) {
            ref.current.removeEventListener("focus", handleFocus);
            ref.current.removeEventListener("blur", handleBlur);
        }
        if (node) {
            node.addEventListener("focus", handleFocus);
            node.addEventListener("blur", handleBlur);
        }
        ref.current = node;
    }, [handleFocus, handleBlur]);
    return [refCallback, isFocused];
}

/**
 * Custom hook to track the state of a media query using the Match Media API
 *
 * @param query - The media query string to match
 * @returns A boolean indicating whether the media query matches
 */
function useMediaQuery(query) {
    // State to track the match status of the media query
    const [matches, setMatches] = react.useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia(query).matches;
        }
        return false;
    });
    react.useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return;
        }
        // Create a MediaQueryList object
        const mediaQueryList = window.matchMedia(query);
        // Event listener to update state when the media query match status changes
        const handleChange = (event) => {
            setMatches(event.matches);
        };
        // Attach the listener
        mediaQueryList.addEventListener('change', handleChange);
        // Initial check to set the state
        setMatches(mediaQueryList.matches);
        // Cleanup listener on component unmount
        return () => {
            mediaQueryList.removeEventListener('change', handleChange);
        };
    }, [query]);
    return matches;
}

function useForm(initialValues, validate, onSubmit) {
    const [values, setValues] = react.useState(initialValues);
    const [errors, setErrors] = react.useState({});
    // Handle form value changes
    const handleChange = react.useCallback((e) => {
        const { name, value } = e.target;
        setValues((prevValues) => (Object.assign(Object.assign({}, prevValues), { [name]: value })));
    }, []);
    // Handle form submission
    const handleSubmit = react.useCallback((e) => {
        e.preventDefault();
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length === 0) {
            onSubmit(values);
        }
        else {
            setErrors(validationErrors);
        }
    }, [values, validate, onSubmit]);
    // Reset form values and errors
    const resetForm = react.useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);
    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
    };
}

exports.useClickOutside = useClickOutside;
exports.useFocus = useFocus;
exports.useForm = useForm;
exports.useIsFirstRender = useIsFirstRender;
exports.useLocalStorage = useLocalStorage;
exports.useMediaQuery = useMediaQuery;
