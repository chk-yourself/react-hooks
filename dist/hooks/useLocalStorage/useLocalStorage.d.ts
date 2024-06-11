type SetValue<T> = (value: T | ((val: T) => T)) => void;
declare function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>];
export default useLocalStorage;
