import React from "react";
import { Stack } from "expo-router";
import { GuestGuard } from "@/components/Guards/GuestGuard";

export default function AuthLayout() {
  return (
    <GuestGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </GuestGuard>
  );
}
