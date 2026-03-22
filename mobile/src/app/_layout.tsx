import "@/config/i18n";

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/providers/react-query";
import { toastConfig } from "@/components/ui/ToastConfig";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
