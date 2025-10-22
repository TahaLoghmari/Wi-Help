import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/providers/react-query.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { env } from "@/config/env";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./react-router";

export const AppProvider = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {env.isDevelopment && <ReactQueryDevtools />}
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
};
