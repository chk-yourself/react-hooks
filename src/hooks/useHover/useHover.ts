import { useCallback, useState, useRef, useEffect } from 'react';

/**
 * Custom hook to track hover state of an element.
 * @returns A tuple containing the ref object and the hover state.
 */
export default function useHover<T extends HTMLElement>(): [(node: T | null) => void, boolean] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T | null>(null);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const refCallback = useCallback((node: T | null) => {
    if (ref.current) {
      ref.current.removeEventListener('mouseenter', handleMouseEnter);
      ref.current.removeEventListener('mouseleave', handleMouseLeave);
    }

    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
    }

    ref.current = node;
  }, [handleMouseEnter, handleMouseLeave]);

  return [refCallback, isHovered];
}
