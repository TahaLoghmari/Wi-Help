import type { HubConnectionState } from "@microsoft/signalr";
import type { QueryClient } from "@tanstack/react-query";

export type RealtimeEventHandler = (...args: unknown[]) => void;

export type RealtimeLifecycleError =
  | { operation: "start"; cause: unknown }
  | { operation: "invoke"; method: string; cause: unknown };

export interface RealtimeLifecycleSnapshot {
  connectionState: HubConnectionState;
  error: RealtimeLifecycleError | null;
}

export interface RealtimeHub {
  readonly isConnected: boolean;
  start(): Promise<void>;
  stop(): Promise<void>;
  invoke(method: string, ...args: unknown[]): Promise<void>;
  on(event: string, handler: RealtimeEventHandler): () => void;
  onStateChange(listener: (state: HubConnectionState) => void): () => void;
  onError(listener: (error: RealtimeLifecycleError) => void): () => void;
}

export interface RealtimeAdapter {
  start(): Promise<void>;
  stop(): Promise<void>;
  getSnapshot(): RealtimeLifecycleSnapshot;
  subscribe(listener: () => void): () => void;
}

export interface RealtimeAdapterFactory<TAdapter extends RealtimeAdapter> {
  create(queryClient: QueryClient): TAdapter;
}
