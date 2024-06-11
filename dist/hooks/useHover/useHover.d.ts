/**
 * Custom hook to track hover state of an element.
 * @returns A tuple containing the ref object and the hover state.
 */
export default function useHover<T extends HTMLElement>(): [(node: T | null) => void, boolean];
