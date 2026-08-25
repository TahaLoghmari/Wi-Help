import "@/global.css";
import React from "react";
import { WelcomeScreen } from "@/features/auth";
import { GuestGuard } from "@/components/guards/guest-guard";

export default function WelcomeRoute() {
  return (
    <GuestGuard>
      <WelcomeScreen />
    </GuestGuard>
  );
}
