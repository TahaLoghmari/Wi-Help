import React from "react";
import { useNotificationHub } from "@/lib/signalr/use-notification-hub";
import { useChatHub } from "@/lib/signalr/use-chat-hub";

export function SignalRProvider({ children }: { children: React.ReactNode }) {
  useNotificationHub();
  useChatHub();

  return <>{children}</>;
}
