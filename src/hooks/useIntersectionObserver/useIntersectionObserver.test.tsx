import { renderHook, act } from '@testing-library/react';
import useIntersectionObserver from './useIntersectionObserver';

describe('useIntersectionObserver hook', () => {
  beforeEach(() => {
    // Mock the IntersectionObserver API
    (global as any).IntersectionObserver = class {
      private callback: IntersectionObserverCallback;
      private elements: Set<Element>;

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        this.elements = new Set();
        (global as any).intersectionObserverInstance = this;
      }

      observe(element: Element) {
        this.elements.add(element);
      }

      unobserve(element: Element) {
        this.elements.delete(element);
      }

      disconnect() {
        this.elements.clear();
      }

      trigger(entries: IntersectionObserverEntry[]) {
        this.callback(entries, this as unknown as IntersectionObserver);
      }
    };
  });

  test('should return false initially', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersectionObserver(ref));
    expect(result.current).toBe(false);
  });

  test('should return true when element is intersecting', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersectionObserver(ref));
    const resizeObserverInstance = (global as any).intersectionObserverInstance;

    act(() => {
      resizeObserverInstance.trigger([
        {
          target: ref.current,
          isIntersecting: true,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(result.current).toBe(true);
  });

  test('should return false when element is not intersecting', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersectionObserver(ref));
    const resizeObserverInstance = (global as any).intersectionObserverInstance;

    act(() => {
      resizeObserverInstance.trigger([
        {
          target: ref.current,
          isIntersecting: false,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(result.current).toBe(false);
  });
});
