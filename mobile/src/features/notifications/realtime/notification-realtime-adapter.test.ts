import { HubConnectionState } from "@microsoft/signalr";
import type { QueryClient } from "@tanstack/react-query";
import type {
  RealtimeHub,
  RealtimeLifecycleError,
} from "@/shared/api/signalr/realtime-types";
import { createNotificationRealtimeAdapter } from "./notification-realtime-adapter";

class FakeHub implements RealtimeHub {
  isConnected = false;
  private handlers = new Map<string, Set<(...args: unknown[]) => void>>();
  private errorListeners = new Set<
    (error: RealtimeLifecycleError) => void
  >();
  start = jest.fn(async (): Promise<void> => undefined);
  stop = jest.fn(async (): Promise<void> => undefined);
  invoke = jest.fn(async (): Promise<void> => undefined);

  on(event: string, handler: (...args: unknown[]) => void) {
    const handlers = this.handlers.get(event) ?? new Set();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => handlers.delete(handler);
  }

  onStateChange(_listener: (state: HubConnectionState) => void) {
    return () => undefined;
  }

  onError(listener: (error: RealtimeLifecycleError) => void) {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  emit(event: string, ...args: unknown[]) {
    for (const handler of this.handlers.get(event) ?? []) handler(...args);
  }

  emitError(error: RealtimeLifecycleError) {
    for (const listener of this.errorListeners) listener(error);
  }
}

describe("notification realtime adapter", () => {
  it("owns notification cache and UI behavior while emitting valid payloads", () => {
    const hub = new FakeHub();
    const invalidateQueries = jest.fn();
    const showNotification = jest.fn();
    const onNotification = jest.fn();
    createNotificationRealtimeAdapter({
      hub,
      queryClient: { invalidateQueries } as unknown as QueryClient,
      showNotification,
      onNotification,
    });

    const notification = {
      id: "notification-1",
      title: "New appointment",
      message: "An appointment was created",
      type: "newAppointment",
      role: "Professional",
      isRead: false,
      createdAt: "2026-08-25T10:00:00.000Z",
    };
    hub.emit("NotificationReceived", notification);

    expect(invalidateQueries.mock.calls).toEqual([
      [{ queryKey: ["notifications"] }],
    ]);
    expect(showNotification).toHaveBeenCalledWith({
      type: "info",
      text1: "New appointment",
      text2: "An appointment was created",
    });
    expect(onNotification).toHaveBeenCalledWith(notification);
  });

  it("ignores malformed payloads", () => {
    const hub = new FakeHub();
    const invalidateQueries = jest.fn();
    const showNotification = jest.fn();
    const onNotification = jest.fn();
    createNotificationRealtimeAdapter({
      hub,
      queryClient: { invalidateQueries } as unknown as QueryClient,
      showNotification,
      onNotification,
    });

    hub.emit("NotificationReceived", {
      title: "Missing required fields",
    });

    expect(invalidateQueries).not.toHaveBeenCalled();
    expect(showNotification).not.toHaveBeenCalled();
    expect(onNotification).not.toHaveBeenCalled();
  });

  it("exposes start failures through its lifecycle snapshot", async () => {
    const hub = new FakeHub();
    const failure = new Error("network unavailable");
    hub.start.mockImplementationOnce(async () => {
      hub.emitError({ operation: "start", cause: failure });
      throw failure;
    });
    const adapter = createNotificationRealtimeAdapter({
      hub,
      queryClient: { invalidateQueries: jest.fn() } as unknown as QueryClient,
      showNotification: jest.fn(),
      onNotification: jest.fn(),
    });
    const listener = jest.fn();
    adapter.subscribe(listener);

    await expect(adapter.start()).rejects.toBe(failure);

    expect(adapter.getSnapshot()).toEqual({
      connectionState: HubConnectionState.Disconnected,
      error: { operation: "start", cause: failure },
    });
    expect(listener).toHaveBeenCalled();
  });
});
