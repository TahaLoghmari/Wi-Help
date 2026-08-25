import { createContext, useContext } from "react";
import type {
  MessagingRealtimeAdapter,
  RealtimeAdapter,
} from "./realtime-types";

interface RealtimeAdapters {
  messagingAdapter: MessagingRealtimeAdapter;
  notificationAdapter: RealtimeAdapter;
}

export const RealtimeAdaptersContext =
  createContext<RealtimeAdapters | null>(null);
export const MessagingRealtimeContext =
  createContext<MessagingRealtimeAdapter | null>(null);

export function useRealtimeAdapters(): RealtimeAdapters {
  const adapters = useContext(RealtimeAdaptersContext);
  if (!adapters) {
    throw new Error("Realtime hooks require SignalRProvider");
  }
  return adapters;
}

export function useMessagingRealtimeAdapter(): MessagingRealtimeAdapter {
  const adapter = useContext(MessagingRealtimeContext);
  if (!adapter) {
    throw new Error("Messaging realtime hooks require SignalRProvider");
  }
  return adapter;
}
