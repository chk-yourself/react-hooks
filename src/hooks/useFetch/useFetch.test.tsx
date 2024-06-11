import { renderHook, waitFor } from '@testing-library/react';
import useFetch from './useFetch';

type FetchResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

// Mock the global fetch function
global.fetch = jest.fn();

describe('useFetch', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('should return data when fetch is successful', async () => {
    const mockData = { name: 'John Doe' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useFetch<typeof mockData>('https://api.example.com/data'),
    );

    // Initially, it should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After the fetch completes, it should have data
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test('should return error when fetch fails', async () => {
    const mockError = new Error('Network response was not ok');
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const { result } = renderHook(() =>
      useFetch<null>('https://api.example.com/data'),
    );

    // Initially, it should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After the fetch completes, it should have an error
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  test('should return loading state initially', () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() =>
      useFetch<null>('https://api.example.com/data'),
    );

    // Initially, it should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
