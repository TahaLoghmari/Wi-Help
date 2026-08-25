import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/entities/session";
import {
  MessagingRealtimeContext,
  RealtimeAdaptersContext,
} from "@/lib/signalr/realtime-context";
import type {
  MessagingRealtimeAdapter,
  RealtimeAdapter,
  RealtimeAdapterFactory,
} from "@/lib/signalr/realtime-types";

interface SignalRProviderProps {
  children: ReactNode;
  messagingAdapterFactory: RealtimeAdapterFactory<MessagingRealtimeAdapter>;
  notificationAdapterFactory: RealtimeAdapterFactory<RealtimeAdapter>;
}

export function SignalRProvider({
  children,
  messagingAdapterFactory,
  notificationAdapterFactory,
}: SignalRProviderProps) {
  const { data: currentUser, isLoading } = useCurrentUser();
  const currentUserId = currentUser?.id;
  const queryClient = useQueryClient();
  const connectedForUser = useRef<string | null>(null);
  const [adapters] = useState(() => ({
    messagingAdapter: messagingAdapterFactory.create(queryClient),
    notificationAdapter: notificationAdapterFactory.create(queryClient),
  }));
  const { messagingAdapter, notificationAdapter } = adapters;

  useEffect(() => {
    if (isLoading || !currentUserId) return;
    if (connectedForUser.current === currentUserId) return;

    connectedForUser.current = currentUserId;
    void notificationAdapter.start().catch(() => undefined);
    void messagingAdapter.start().catch(() => undefined);

    return () => {
      void notificationAdapter.stop().catch(() => undefined);
      void messagingAdapter.stop().catch(() => undefined);
      connectedForUser.current = null;
    };
  }, [currentUserId, isLoading, messagingAdapter, notificationAdapter]);

  return (
    <RealtimeAdaptersContext.Provider value={adapters}>
      <MessagingRealtimeContext.Provider value={messagingAdapter}>
        {children}
      </MessagingRealtimeContext.Provider>
    </RealtimeAdaptersContext.Provider>
  );
}
