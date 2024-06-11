type SetValue<T> = (value: T | ((val: T) => T)) => void;
/**
 * Custom hook to sync state with localStorage.
 *
 * @param key - The key under which the value is stored in localStorage.
 * @param initialValue - The initial value to use if no value is found in localStorage.
 * @returns A stateful value and a function to update it.
 */
declare function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>];
export default useLocalStorage;
