import "@/global.css";
import React from "react";
import { router } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";
import { WelcomeScreen } from "@/features/auth";
import { GuestGuard } from "@/components/guards/guest-guard";

export default function WelcomeRoute() {
  return (
    <GuestGuard>
      <WelcomeScreen
        onLogin={() => router.push(ROUTE_PATHS.AUTH.LOGIN)}
        onRegister={() => router.push(ROUTE_PATHS.AUTH.REGISTER)}
      />
    </GuestGuard>
  );
}
