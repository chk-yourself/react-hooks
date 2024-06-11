/**
 * Custom hook that tracks the previous value of a given state or prop.
 *
 * @param value - The value to track.
 * @returns The previous value.
 */
declare function usePrevious<T>(value: T): T | undefined;
export default usePrevious;
