import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

/**
 * Custom hook to detect clicks outside a specified element.
 * Optionally accepts an existing ref as a parameter to allow better composition 
 * with other hooks or components that may also need to manage the same ref
 * 
 * @param callback - Function to call when a click outside is detected.
 * @param externalRef - Optional external ref to use instead of the internal one.
 * @returns A ref object to be assigned to the element to be monitored.
 */
export default function useClickOutside<T extends HTMLElement>(
  callback: (e: MouseEvent) => void,
  externalRef?: MutableRefObject<T | null>
): MutableRefObject<T | null> {
  // Create an internal ref if no external ref is provided
  const internalRef = useRef<T | null>(null);

  // Use the external ref if provided, otherwise use the internal ref
  const ref = externalRef || internalRef;

  useEffect(() => {
    // Handler function to be called on document click
    const handleClickOutside = (e: MouseEvent) => {
      // Check if the click is outside the ref element
      if (ref.current && !ref.current.contains(e.target as Node)) {
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
