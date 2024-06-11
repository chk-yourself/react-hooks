import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useResizeObserver from './useResizeObserver';

describe('useResizeObserver', () => {
  beforeAll(() => {
    // Mock implementation of the ResizeObserver
    (global as any).ResizeObserver = class {
      private callback: ResizeObserverCallback;
      private elements: Set<Element>;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        this.elements = new Set();
        // Store the instance globally for triggering in tests
        (global as any).resizeObserverInstance = this;
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

      // Trigger the callback with mock entries
      trigger(entries: ResizeObserverEntry[]) {
        this.callback(entries, this as unknown as ResizeObserver);
      }
    };
  });

  test('should return initial dimensions as zero', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useResizeObserver(ref));

    // Initial state should have all dimensions set to zero
    expect(result.current).toEqual({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    });
  });

  test('should update dimensions when resized', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useResizeObserver(ref));
    const resizeObserverInstance = (global as any).resizeObserverInstance;

    // Simulate a resize event
    act(() => {
      resizeObserverInstance.trigger([
        {
          target: ref.current,
          contentRect: {
            bottom: 100,
            height: 100,
            left: 0,
            right: 100,
            top: 0,
            width: 100,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRectReadOnly,
        } as unknown as ResizeObserverEntry,
      ]);
    });

    // State should be updated to reflect new dimensions
    expect(result.current).toEqual({
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
    });
  });
});
