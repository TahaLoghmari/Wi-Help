import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/providers/react-query.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { PageLoading } from "@/components/ui/page-loading";
import { ErrorBoundary } from "@/providers/error-boundary";
import { Suspense } from "react";
import { env } from "@/config/env";

type AppProviderProps = {
  children?: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageLoading />}>
          <ErrorBoundary showDetails={env.isDevelopment}>
            {children}
          </ErrorBoundary>
        </Suspense>
        {env.isDevelopment && <ReactQueryDevtools />}
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
};
