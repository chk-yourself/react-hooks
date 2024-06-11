export default function useFocus<T extends HTMLElement>(): [
    (node: T | null) => void,
    boolean
];
