import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/providers/react-query.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { PageLoading } from "@/components/ui/page-loading";
import { ErrorBoundary } from "@/providers/error-boundary";
import { Suspense } from "react";
import { env } from "@/config/env";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./react-router";

type AppProviderProps = {
  children?: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {env.isDevelopment && <ReactQueryDevtools />}
        <Toaster />
        <Suspense fallback={<PageLoading />}>
          <ErrorBoundary showDetails={env.isDevelopment}>
            {children}
          </ErrorBoundary>
        </Suspense>
      </QueryClientProvider>
    </HelmetProvider>
  );
};
