import { renderHook } from '@testing-library/react-hooks';
import useIsFirstRender from './useIsFirstRender';

test('should return true on first render and false afterwards', () => {
  const { result, rerender } = renderHook(() => useIsFirstRender());

  expect(result.current).toBe(true);

  rerender();

  expect(result.current).toBe(false);
});
