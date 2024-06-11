import { renderHook, fireEvent } from '@testing-library/react';
import { MutableRefObject } from 'react';
import useClickOutside from './useClickOutside';

describe('useClickOutside', () => {
  // Utility function to create a div element and append it to the document body
  const createDivElement = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
  };

  // Cleanup function to remove all div elements after each test
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // Test case: should call the callback when clicking outside the element
  test('should call the callback when clicking outside the element', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    // Get the ref from the hook
    const ref = result.current;

    // Create a div element and assign it to the ref
    const div = createDivElement();
    ref.current = div;

    // Simulate a click outside the element
    fireEvent.mouseDown(document.body);

    // Assert that the callback is called
    expect(callback).toHaveBeenCalledTimes(1);
  });

  // Test case: should not call the callback when clicking inside the element
  test('should not call the callback when clicking inside the element', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    // Get the ref from the hook
    const ref = result.current;

    // Create a div element and assign it to the ref
    const div = createDivElement();
    ref.current = div;

    // Simulate a click inside the element
    fireEvent.mouseDown(div);

    // Assert that the callback is not called
    expect(callback).not.toHaveBeenCalled();
  });

  // Test case: should support using an external ref
  test('should support using an external ref', () => {
    const callback = jest.fn();
    const externalRef = {
      current: null,
    } as MutableRefObject<HTMLDivElement | null>;
    const { result } = renderHook(() => useClickOutside(callback, externalRef));

    // Create a div element and assign it to the external ref
    const div = createDivElement();
    externalRef.current = div;

    // Simulate a click outside the element
    fireEvent.mouseDown(document.body);

    // Assert that the callback is called
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
