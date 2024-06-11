declare const useScrollLock: () => {
    ref: import("react").MutableRefObject<HTMLElement | null>;
    lock: () => void;
    unlock: () => void;
};
export default useScrollLock;
