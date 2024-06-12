interface UseClipboardReturn {
    copyToClipboard: (text: string) => void;
    isCopied: boolean;
    error: string | null;
}
declare const useClipboard: () => UseClipboardReturn;
export default useClipboard;
