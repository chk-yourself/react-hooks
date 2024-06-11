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

exports.useClickOutside = useClickOutside;
exports.useFocus = useFocus;
exports.useIsFirstRender = useIsFirstRender;
exports.useLocalStorage = useLocalStorage;
