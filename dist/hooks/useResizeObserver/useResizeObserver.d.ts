export default function useResizeObserver<T extends HTMLElement>(ref: React.RefObject<T>): {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
};
