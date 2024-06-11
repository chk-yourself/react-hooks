import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  test('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  test('should return the debounced value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      },
    );

    // Initially, the debounced value should be the same as the input value
    expect(result.current).toBe('test');

    // Change the value
    rerender({ value: 'updated', delay: 500 });

    // The debounced value should still be 'test' because the delay hasn't passed
    expect(result.current).toBe('test');

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // The debounced value should now be 'updated'
    expect(result.current).toBe('updated');
  });

  test('should handle multiple rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test1', delay: 500 },
      },
    );

    expect(result.current).toBe('test1');

    rerender({ value: 'test2', delay: 500 });
    rerender({ value: 'test3', delay: 500 });

    // Advance time by 499ms, value should still be the initial one
    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(result.current).toBe('test1');

    // Advance time by 1ms to complete the 500ms delay
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // The debounced value should now be the last value 'test3'
    expect(result.current).toBe('test3');
  });
});
