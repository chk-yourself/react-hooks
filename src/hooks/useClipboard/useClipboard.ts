import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copyToClipboard: (text: string) => void;
  isCopied: boolean;
  error: string | null;
}

const useClipboard = (): UseClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      setError('Failed to copy');
      setIsCopied(false);
    }
  }, []);

  return { copyToClipboard, isCopied, error };
};

export default useClipboard;
