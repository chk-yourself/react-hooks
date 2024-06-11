import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useFocus from './useFocus';

describe('useFocus hook', () => {
  // Test case to check the initial state of the hook
  test('should return false initially', () => {
    const { result } = renderHook(() => useFocus());

    // Asserting that the initial focus state is false
    expect(result.current[1]).toBe(false);
  });

  // Test case to check if the hook returns true when the element is focused
  test('should return true when the element is focused', () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>());
    const [refCallback] = result.current;

    act(() => {
      const inputElement = document.createElement('input');
      refCallback(inputElement);
      // manually trigger focus event
      inputElement.dispatchEvent(new FocusEvent('focus'));
    });

    // Asserting that the focus state is true after focusing the element
    expect(result.current[1]).toBe(true);
  });

  // Test case to check if the hook returns false when the element is blurred
  test('should return false when the element is blurred', () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>());
    const [refCallback] = result.current;

    act(() => {
      const inputElement = document.createElement('input');
      refCallback(inputElement);
      // manually trigger focus and blur events
      inputElement.dispatchEvent(new FocusEvent('focus'));
      inputElement.dispatchEvent(new FocusEvent('blur'));
    });

    // Asserting that the focus state is false after blurring the element
    expect(result.current[1]).toBe(false);
  });
});
