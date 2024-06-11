import { useLayoutEffect, useCallback, useRef } from "react";

interface OriginalStyleProps {
  overflow: CSSStyleDeclaration['overflow'];
  paddingRight: CSSStyleDeclaration['paddingRight'];
}

const useScrollLock = () => {
  const ref = useRef<HTMLElement | null>(null);
  const originalStyle = useRef<OriginalStyleProps | null>(null);

  const lock = useCallback(() => {
    if (ref.current) {
      const { overflow, paddingRight } = window.getComputedStyle(ref.current);

      // Save original styles
      originalStyle.current = { overflow, paddingRight };

      ref.current.style.overflow = 'hidden';

      // Prevent width reflow after removing the scrollbar by adding scrollbar width to right-padding
      const scrollbarWidth = ref.current.offsetWidth - ref.current.clientWidth;
      ref.current.style.paddingRight = `${(parseInt(paddingRight) || 0) + scrollbarWidth}px`;

    }
  }, []);

  // Restore original styles
  const unlock = useCallback(() => {
    if (ref.current && originalStyle.current) {
      ref.current.style.overflow = originalStyle.current.overflow
      ref.current.style.paddingRight = originalStyle.current.paddingRight
    }
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) {
      ref.current = document.body;
    }

    return () => {
      if (ref.current) {
        unlock();
      }

    };
  }, [unlock]);

  return { ref, lock, unlock };
};

export default useScrollLock;