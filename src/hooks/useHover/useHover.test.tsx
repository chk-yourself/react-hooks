import { fireEvent, renderHook, act } from '@testing-library/react';
import useHover from './useHover';

describe('useHover hook', () => {
  test('should return false initially', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());
    const [hoverRef, isHovered] = result.current;

    expect(isHovered).toBe(false);
  });

  test('should return true when mouse enters and false when mouse leaves', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());
    const [hoverRef, isHovered] = result.current;

    const divElement = document.createElement('div');
    hoverRef(divElement);

    act(() => {
      fireEvent.mouseEnter(divElement);
    });

    expect(result.current[1]).toBe(true);

    act(() => {
      fireEvent.mouseLeave(divElement);
    });

    expect(result.current[1]).toBe(false);
  });
});
