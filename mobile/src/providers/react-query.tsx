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
 * Native focus refetch remains intentionally disabled. Native connectivity
 * refetch would require an onlineManager network listener; this app currently
 * has no NetInfo/expo-network integration. On web, the built-in browser listeners
 * apply. Do not treat refetchOnReconnect alone as native network detection.
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
