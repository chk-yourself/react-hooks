
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { useRef, useEffect, useState, useCallback } from 'react';

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

function useLocalStorage(key, initialValue) {
    // State to store the value
    const [storedValue, setStoredValue] = useState(() => {
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
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        catch (error) {
            console.error(error);
        }
    }, [key, storedValue] // Ensure the effect is only triggered when key or storedValue changes
    );
    // Listen for storage changes (from other tabs/windows)
    useEffect(() => {
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
        // Add event listener
        window.addEventListener('storage', handleStorageChange);
        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);
    return [storedValue, setValue];
}

export { useClickOutside, useIsFirstRender, useLocalStorage };
