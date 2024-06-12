import { renderHook, act } from '@testing-library/react';
import useIdle from './useIdle';

jest.useFakeTimers();

describe('useIdle', () => {
  test('should set isIdle to true after idleTime', () => {
    const onIdle = jest.fn();
    const { result } = renderHook(() => useIdle({ idleTime: 5000, onIdle }));

    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current).toBe(true);
    expect(onIdle).toHaveBeenCalled();
  });

  test('should reset idle timer on activity', () => {
    const onIdle = jest.fn();
    const onActive = jest.fn();
    const { result } = renderHook(() =>
      useIdle({ idleTime: 5000, onIdle, onActive }),
    );

    act(() => {
      jest.advanceTimersByTime(3000);
      window.dispatchEvent(new Event('mousemove'));
      jest.advanceTimersByTime(2000);
    });

    expect(result.current).toBe(false);
    expect(onActive).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(true);
    expect(onIdle).toHaveBeenCalled();
  });

  test('should call onActive when activity is detected after idle', () => {
    const onIdle = jest.fn();
    const onActive = jest.fn();
    const { result } = renderHook(() =>
      useIdle({ idleTime: 5000, onIdle, onActive }),
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current).toBe(true);
    expect(onIdle).toHaveBeenCalled();

    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    expect(result.current).toBe(false);
    expect(onActive).toHaveBeenCalled();
  });
});
