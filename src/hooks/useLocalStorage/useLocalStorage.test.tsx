import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

// Mock localStorage before each test to ensure a clean state
beforeEach(() => {
  // Store object to hold localStorage values
  let store: { [key: string]: string } = {};

  // Mock implementation of localStorage
  const localStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  // Define the localStorage property on the window object
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

describe('useLocalStorage', () => {
  // Test to check if the hook initializes with the value from localStorage
  it('should initialize with value from localStorage', () => {
    // Set an initial value in localStorage
    window.localStorage.setItem('testKey', JSON.stringify('storedValue'));

    // Render the hook
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue'),
    );

    // Check if the initial state is the value from localStorage
    expect(result.current[0]).toBe('storedValue');
  });

  // Test to check if the hook initializes with the default value if localStorage is empty
  it('should initialize with default value if localStorage is empty', () => {
    window.localStorage.removeItem('testKey');
    // Render the hook without setting any value in localStorage
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue'),
    );

    // Check if the initial state is the default value
    expect(result.current[0]).toBe('defaultValue');
  });

  // Test to check if localStorage is updated when the state changes
  it('should update localStorage when state changes', () => {
    // Render the hook
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue'),
    );

    // Update the state using the setter function
    act(() => {
      result.current[1]('newValue');
    });

    // Check if localStorage is updated with the new value
    expect(window.localStorage.getItem('testKey')).toBe(
      JSON.stringify('newValue'),
    );
  });

  // Test to check if the state is updated when localStorage changes
  it('should update state when localStorage changes', () => {
    // Render the hook
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue'),
    );

    // Simulate a change in localStorage from another tab or window
    act(() => {
      window.localStorage.setItem('testKey', JSON.stringify('newValue'));
      // Dispatch a storage event to simulate the change
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'testKey',
          newValue: JSON.stringify('newValue'),
        }),
      );
    });

    // Check if the state is updated with the new value from localStorage
    expect(result.current[0]).toBe('newValue');
  });
});
