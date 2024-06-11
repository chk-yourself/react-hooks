import { useEffect, useRef } from 'react';

/**
 * Custom hook that tracks the previous value of a given state or prop.
 *
 * @param value - The value to track.
 * @returns The previous value.
 */
function usePrevious<T>(value: T): T | undefined {
  // Create a ref to store the previous value
  const prevValue = useRef<T>();

  // Update the ref with the current value after the component has rendered
  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  // Return the previous value (current value of the ref).

  /* Because useEffect runs asynchronously after every render of the consuming 
    component, prevValue.current returns the previously stored value before it is updated in useEffect above
  */
  return prevValue.current;
}

export default usePrevious;
