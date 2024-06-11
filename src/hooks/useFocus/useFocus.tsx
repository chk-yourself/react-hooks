import { useCallback, useRef, useState } from "react";

export default function useFocus<T extends HTMLElement>(): [
  (node: T | null) => void,
  boolean,
] {
  const ref = useRef<T | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const refCallback = useCallback(
    (node: T | null) => {
      if (ref.current) {
        ref.current.removeEventListener("focus", handleFocus);
        ref.current.removeEventListener("blur", handleBlur);
      }

      if (node) {
        node.addEventListener("focus", handleFocus);
        node.addEventListener("blur", handleBlur);
      }

      ref.current = node;
    },
    [handleFocus, handleBlur],
  );

  return [refCallback, isFocused];
}
