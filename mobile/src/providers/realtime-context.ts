import { createContext, useContext } from "react";
import type { MessagingRealtimeAdapter } from "@/features/messaging/realtime";
import type { RealtimeAdapter } from "@/shared/api/signalr/realtime-types";

interface RealtimeAdapters {
  messagingAdapter: MessagingRealtimeAdapter;
  notificationAdapter: RealtimeAdapter;
}

export const RealtimeAdaptersContext = createContext<RealtimeAdapters | null>(
  null,
);

export function useRealtimeAdapters(): RealtimeAdapters {
  const adapters = useContext(RealtimeAdaptersContext);
  if (!adapters) {
    throw new Error("Realtime hooks require SignalRProvider");
  }
  return adapters;
}
