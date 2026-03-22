/**
 * React Query (TanStack Query) configuration.
 *
 * Mirrors: /frontend/src/providers/react-query.tsx
 *
 * Identical default options to the web app:
 * - refetchOnWindowFocus: false
 * - refetchOnReconnect: true
 * - retry: false
 * - staleTime: 5 minutes
 * - gcTime: 10 minutes
 * - mutations retry: 0
 *
 * Note: `refetchOnWindowFocus` has no direct equivalent in React Native,
 * but TanStack Query handles this gracefully — it is simply a no-op on
 * platforms without a window focus event.
 */

import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    retry: false,

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
