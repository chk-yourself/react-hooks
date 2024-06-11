export type FetchResult<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};
export default function useFetch<T>(url: string, options?: RequestInit): FetchResult<T>;
