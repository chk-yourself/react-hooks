import { renderHook } from '@testing-library/react';
import usePrevious from './usePrevious';

describe('usePrevious', () => {
  test('should return undefined initially', () => {
    const { result } = renderHook(() => usePrevious(0));

    expect(result.current).toBeUndefined();
  });

  test('should return the previous value after update', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 1 });
    expect(result.current).toBe(0);

    rerender({ value: 2 });
    expect(result.current).toBe(1);
  });
});
