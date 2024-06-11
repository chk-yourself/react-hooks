import { renderHook, act } from '@testing-library/react';
import useMediaQuery from './useMediaQuery';

describe('useMediaQuery', () => {
  beforeAll(() => {
    // Mock the window.matchMedia API
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => {
        let matches = false;

        const listeners: Array<(event: MediaQueryListEvent) => void> = [];

        const instance = {
          matches,
          media: query,
          addEventListener: (
            event: 'change',
            listener: (event: MediaQueryListEvent) => void,
          ) => {
            listeners.push(listener);
          },
          removeEventListener: (
            event: 'change',
            listener: (event: MediaQueryListEvent) => void,
          ) => {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
              listeners.splice(index, 1);
            }
          },
          dispatchEvent: (event: MediaQueryListEvent) => {
            listeners.forEach((listener) => listener(event));
            return true;
          },
        };

        return instance;
      }),
    });
  });

  test('should return false initially when the media query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(false);
  });

  test('should return true when the media query matches', () => {
    // Override the initial value of matches
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(true);
  });

  test('should update the state when the media query changes', () => {
    let matchMediaCallback: (event: MediaQueryListEvent) => void = () => {};

    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: (
        event: 'change',
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        if (event === 'change') {
          matchMediaCallback = listener;
        }
      },
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(false);

    // Simulate a change in the media query
    act(() => {
      matchMediaCallback({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });
});
