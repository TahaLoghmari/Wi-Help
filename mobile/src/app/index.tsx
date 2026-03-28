import "@/global.css";
import React from "react";
import { WelcomeScreen } from "@/features/auth/components/welcome/welcome-screen";
import { GuestGuard } from "@/components/guards/guest-guard";

export default function WelcomeRoute() {
  return (
    <GuestGuard>
      <WelcomeScreen />
    </GuestGuard>
  );
}
