import React from "react";
import { router } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";
import { LoginScreen } from "@/features/auth";

export default function LoginRoute() {
  return (
    <LoginScreen
      onBack={() => router.replace(ROUTE_PATHS.WELCOME)}
      onRegister={() => router.push(ROUTE_PATHS.AUTH.REGISTER)}
    />
  );
}
