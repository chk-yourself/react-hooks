import { useEffect, useState } from 'react';

export default function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T>,
): {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
} {
  const [contentRect, setContentRect] = useState({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === ref.current) {
          setContentRect({
            bottom: entry.contentRect.bottom,
            height: entry.contentRect.height,
            left: entry.contentRect.left,
            right: entry.contentRect.right,
            top: entry.contentRect.top,
            width: entry.contentRect.width,
          });
          break;
        }
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return contentRect;
}
