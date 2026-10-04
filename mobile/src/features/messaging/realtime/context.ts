import { createContext, useContext } from "react";
import type { MessagingRealtimeAdapter } from "./types";

export const MessagingRealtimeContext =
  createContext<MessagingRealtimeAdapter | null>(null);

export function useMessagingRealtimeAdapter(): MessagingRealtimeAdapter {
  const adapter = useContext(MessagingRealtimeContext);
  if (!adapter) {
    throw new Error("Messaging realtime hooks require SignalRProvider");
  }
  return adapter;
}
