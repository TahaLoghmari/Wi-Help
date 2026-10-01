import { HubConnectionState } from "@microsoft/signalr";
import type { QueryClient } from "@tanstack/react-query";
import type {
  RealtimeHub,
  RealtimeLifecycleError,
} from "@/shared/api/signalr/realtime-types";
import {
  createMessagingRealtimeAdapter,
  createMessagingRealtimeAdapterFactory,
} from "./messaging-realtime-adapter";

class FakeHub implements RealtimeHub {
  isConnected = false;
  private handlers = new Map<string, Set<(...args: unknown[]) => void>>();
  private stateListeners = new Set<(state: HubConnectionState) => void>();
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

  onStateChange(listener: (state: HubConnectionState) => void) {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  onError(listener: (error: RealtimeLifecycleError) => void) {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  emit(event: string, ...args: unknown[]) {
    for (const handler of this.handlers.get(event) ?? []) handler(...args);
  }

  setConnectionState(state: HubConnectionState) {
    this.isConnected = state === HubConnectionState.Connected;
    for (const listener of this.stateListeners) listener(state);
  }

  emitError(error: RealtimeLifecycleError) {
    for (const listener of this.errorListeners) listener(error);
  }
}

function setup() {
  const hub = new FakeHub();
  const invalidateQueries = jest.fn();
  const queryClient = { invalidateQueries } as unknown as QueryClient;
  const adapter = createMessagingRealtimeAdapter({ hub, queryClient });
  return { adapter, hub, invalidateQueries };
}

describe("messaging realtime adapter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("owns validated online and typing state", () => {
    const { adapter, hub } = setup();

    hub.emit("OnlineUsers", ["user-1"]);
    hub.emit("UserOnline", "user-2");
    hub.emit("UserTyping", "conversation-1", "user-2");

    expect(adapter.getSnapshot().onlineUserIds).toEqual(
      new Set(["user-1", "user-2"]),
    );
    expect(adapter.getSnapshot().typingUserIds.get("conversation-1")).toEqual(
      new Set(["user-2"]),
    );

    hub.emit("UserOnline", 42);
    hub.emit("UserTyping", "conversation-1");
    expect(adapter.getSnapshot().onlineUserIds).toEqual(
      new Set(["user-1", "user-2"]),
    );

    jest.advanceTimersByTime(5000);
    expect(
      adapter.getSnapshot().typingUserIds.get("conversation-1"),
    ).toBeUndefined();
  });

  it("applies conversation cache policy only for valid events", () => {
    const { hub, invalidateQueries } = setup();

    hub.emit("MessageReceived", { conversationId: "conversation-1" });

    expect(invalidateQueries).toHaveBeenNthCalledWith(1, {
      queryKey: ["messages", "conversation-1"],
    });
    expect(invalidateQueries).toHaveBeenNthCalledWith(2, {
      queryKey: ["conversations"],
    });

    hub.emit("MessagesRead", {});
    expect(invalidateQueries).toHaveBeenCalledTimes(2);

    hub.emit("NewMessageNotification");
    expect(invalidateQueries).toHaveBeenNthCalledWith(3, {
      queryKey: ["conversations"],
    });
  });

  it("preserves connection commands and clears presence when stopped", async () => {
    const { adapter, hub } = setup();
    hub.emit("OnlineUsers", ["user-1"]);

    await adapter.start();
    adapter.joinConversation("conversation-1");
    adapter.startTyping("conversation-1");
    await adapter.stop();

    expect(hub.start).toHaveBeenCalledTimes(1);
    expect(hub.invoke).toHaveBeenNthCalledWith(
      1,
      "JoinConversation",
      "conversation-1",
    );
    expect(hub.invoke).toHaveBeenNthCalledWith(
      2,
      "StartTyping",
      "conversation-1",
    );
    expect(hub.stop).toHaveBeenCalledTimes(1);
    expect(adapter.getSnapshot().onlineUserIds).toEqual(new Set());
  });

  it("publishes transport failures and clears them on intentional stop", async () => {
    const { adapter, hub } = setup();
    const failure = new Error("send failed");
    const pendingInvoke = new Promise<void>(() => undefined);
    const catchSpy = jest.spyOn(pendingInvoke, "catch");
    hub.invoke.mockReturnValueOnce(pendingInvoke);

    adapter.joinConversation("conversation-1");
    hub.emitError({
      operation: "invoke",
      method: "JoinConversation",
      cause: failure,
    });

    expect(catchSpy).toHaveBeenCalledTimes(1);
    expect(adapter.getSnapshot().error).toEqual({
      operation: "invoke",
      method: "JoinConversation",
      cause: failure,
    });

    await adapter.stop();
    expect(adapter.getSnapshot()).toMatchObject({
      connectionState: HubConnectionState.Disconnected,
      error: null,
    });
  });

  it("constructs its hub through the injected factory and preserves reconnect behavior", () => {
    const hub = new FakeHub();
    let onReconnected: (() => void) | undefined;
    const createHub = jest.fn(
      (options: { onReconnected(): void }): RealtimeHub => {
        onReconnected = options.onReconnected;
        return hub;
      },
    );
    const factory = createMessagingRealtimeAdapterFactory(createHub);

    factory.create({ invalidateQueries: jest.fn() } as unknown as QueryClient);
    onReconnected?.();

    expect(createHub).toHaveBeenCalledTimes(1);
    expect(hub.invoke).toHaveBeenCalledWith("GetOnlineUsers");
  });
});
