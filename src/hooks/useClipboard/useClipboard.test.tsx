import { renderHook, act } from '@testing-library/react';
import useClipboard from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    // Mock the clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test');
    expect(result.current.isCopied).toBe(true);
    expect(result.current.error).toBe(null);
  });

  test('should handle copy error', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Failed to copy');
    });

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test');
    });

    expect(result.current.isCopied).toBe(false);
    expect(result.current.error).toBe('Failed to copy');
  });

  test('should reset isCopied after 2 seconds', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test');
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.isCopied).toBe(false);
  });
});
