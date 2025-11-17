import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

function isRetriableError(error: any): boolean {
  if (!error.response) return true; // Network error
  const status = error.response?.status;
  return status >= 500 && status < 600; // Server errors
}

const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    // Retry with exponential backoff
    retry: (failureCount, error) => {
      if (!isRetriableError(error)) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  },
  mutations: {
    retry: 0,
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
