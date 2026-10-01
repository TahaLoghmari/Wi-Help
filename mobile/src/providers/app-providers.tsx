import "@/shared/config/i18n";
import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { toastConfig } from "@/shared/ui/toast-config";
import { queryClient } from "./react-query";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toast config={toastConfig} />
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
