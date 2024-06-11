import { renderHook, act } from '@testing-library/react';
import useScrollLock from './useScrollLock';

describe('useScrollLock', () => {
  test('should lock and unlock the scroll', () => {
    const { result } = renderHook(() => useScrollLock());
    const { overflow } = window.getComputedStyle(document.body);

    // Initial state should be scroll unlocked
    expect(document.body.style.overflow).toBe(overflow);

    // Lock the scroll
    act(() => {
      result.current.lock();
    });
    expect(document.body.style.overflow).toBe('hidden');

    // Unlock the scroll
    act(() => {
      result.current.unlock();
    });
    expect(document.body.style.overflow).toBe(overflow);
  });

  test('should add paddingRight to avoid reflow issues', () => {
    const { result } = renderHook(() => useScrollLock());
    const { paddingRight } = window.getComputedStyle(document.body);

    act(() => {
      result.current.lock();
    });

    // Check if paddingRight is added correctly
    const scrollbarWidth =
      document.body.offsetWidth - document.body.clientWidth;
    expect(document.body.style.paddingRight).toBe(
      `${(parseInt(paddingRight) || 0) + scrollbarWidth}px`,
    );

    act(() => {
      result.current.unlock();
    });

    // Check if paddingRight is reset correctly
    expect(document.body.style.paddingRight).toBe(paddingRight);
  });

  test('should restore original styles on unmount', () => {
    const { result, unmount } = renderHook(() => useScrollLock());
    const { overflow, paddingRight } = window.getComputedStyle(document.body);
    act(() => {
      result.current.lock();
    });
    expect(document.body.style.overflow).toBe('hidden');

    const scrollbarWidth =
      document.body.offsetWidth - document.body.clientWidth;
    expect(document.body.style.paddingRight).toBe(
      `${(parseInt(paddingRight) || 0) + scrollbarWidth}px`,
    );

    unmount();
    expect(document.body.style.overflow).toBe(overflow);
    expect(document.body.style.paddingRight).toBe(paddingRight);
  });
});
