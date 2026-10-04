import React from "react";
import { router } from "expo-router";
import { ROUTE_PATHS } from "@/app-composition/routes";
import { RegisterScreen } from "@/features/auth";

export default function RegisterRoute() {
  return (
    <RegisterScreen
      onBack={() => router.back()}
      onLogin={() => router.push(ROUTE_PATHS.AUTH.LOGIN)}
    />
  );
}
