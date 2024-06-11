
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';

function useIsFirstRender() {
    const isFirstRender = useRef(true);
    useEffect(() => {
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
    const internalRef = useRef(null);
    // Use the external ref if provided, otherwise use the internal ref
    const ref = externalRef || internalRef;
    useEffect(() => {
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
    const [storedValue, setStoredValue] = useState(() => {
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
    const setValue = useCallback((value) => {
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
    useEffect(() => {
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
    const ref = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);
    const refCallback = useCallback((node) => {
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
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia(query).matches;
        }
        return false;
    });
    useEffect(() => {
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
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    // Handle form value changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prevValues) => (Object.assign(Object.assign({}, prevValues), { [name]: value })));
    }, []);
    // Handle form submission
    const handleSubmit = useCallback((e) => {
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
    const resetForm = useCallback(() => {
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

function useResizeObserver(ref) {
    const [contentRect, setContentRect] = useState({
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
    });
    useEffect(() => {
        if (!ref.current)
            return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.target === ref.current) {
                    setContentRect({
                        bottom: entry.contentRect.bottom,
                        height: entry.contentRect.height,
                        left: entry.contentRect.left,
                        right: entry.contentRect.right,
                        top: entry.contentRect.top,
                        width: entry.contentRect.width,
                    });
                    break;
                }
            }
        });
        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, [ref]);
    return contentRect;
}

/**
 * Custom hook to track hover state of an element.
 * @returns A tuple containing the ref object and the hover state.
 */
function useHover() {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const refCallback = useCallback((node) => {
        if (ref.current) {
            ref.current.removeEventListener('mouseenter', handleMouseEnter);
            ref.current.removeEventListener('mouseleave', handleMouseLeave);
        }
        if (node) {
            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);
        }
        ref.current = node;
    }, [handleMouseEnter, handleMouseLeave]);
    return [refCallback, isHovered];
}

/**
 * Custom hook to check if a DOM element is visible on the screen using Intersection Observer API.
 * @param ref A ref object pointing to the DOM element to observe.
 * @param options Intersection Observer options.
 * @returns A boolean indicating whether the element is intersecting.
 */
function useIntersectionObserver(ref, options) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
        if (!ref.current)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);
        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, [ref, options]);
    return isIntersecting;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function useFetch(url, options) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url, options);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = yield response.json();
                setData(result);
            }
            catch (error) {
                setError(error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchData();
    }, [url, options]);
    return { data, error, loading };
}

/**
 * Custom hook that tracks the previous value of a given state or prop.
 *
 * @param value - The value to track.
 * @returns The previous value.
 */
function usePrevious(value) {
    // Create a ref to store the previous value
    const prevValue = useRef();
    // Update the ref with the current value after the component has rendered
    useEffect(() => {
        prevValue.current = value;
    }, [value]);
    // Return the previous value (current value of the ref).
    /* Because useEffect runs asynchronously after every render of the consuming
      component, prevValue.current returns the previously stored value before it is updated in useEffect above
    */
    return prevValue.current;
}

function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const useScrollLock = () => {
    const ref = useRef(null);
    const originalStyle = useRef(null);
    const lock = useCallback(() => {
        if (ref.current) {
            const { overflow, paddingRight } = window.getComputedStyle(ref.current);
            // Save original styles
            originalStyle.current = { overflow, paddingRight };
            ref.current.style.overflow = 'hidden';
            // Prevent width reflow after removing the scrollbar by adding scrollbar width to right-padding
            const scrollbarWidth = ref.current.offsetWidth - ref.current.clientWidth;
            ref.current.style.paddingRight = `${(parseInt(paddingRight) || 0) + scrollbarWidth}px`;
        }
    }, []);
    // Restore original styles
    const unlock = useCallback(() => {
        if (ref.current && originalStyle.current) {
            ref.current.style.overflow = originalStyle.current.overflow;
            ref.current.style.paddingRight = originalStyle.current.paddingRight;
        }
    }, []);
    useLayoutEffect(() => {
        if (!ref.current) {
            ref.current = document.body;
        }
        return () => {
            if (ref.current) {
                unlock();
            }
        };
    }, [unlock]);
    return { ref, lock, unlock };
};

export { useClickOutside, useDebounce, useFetch, useFocus, useForm, useHover, useIntersectionObserver, useIsFirstRender, useLocalStorage, useMediaQuery, usePrevious, useResizeObserver, useScrollLock };
