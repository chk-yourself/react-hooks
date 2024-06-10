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
export default function useClickOutside<T extends HTMLElement>(callback: (e: MouseEvent) => void, externalRef?: MutableRefObject<T | null>): MutableRefObject<T | null>;
