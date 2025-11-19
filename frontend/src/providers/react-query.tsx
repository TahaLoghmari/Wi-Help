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
