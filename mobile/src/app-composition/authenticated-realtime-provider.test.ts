import { HubConnectionState } from "@microsoft/signalr";
import type { QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { SignalRService } from "@/lib/signalr";
import type {
  RealtimeHub,
  RealtimeLifecycleError,
} from "@/lib/signalr/realtime-types";
import { authenticatedNotificationRealtimeAdapterFactory } from "./authenticated-realtime-provider";

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));
jest.mock("@/lib/signalr", () => ({ SignalRService: jest.fn() }));
jest.mock("@/features/messaging", () => ({
  messagingRealtimeAdapterFactory: { create: jest.fn() },
}));
jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: { FlatList: "FlatList", View: "View" },
  useAnimatedScrollHandler: jest.fn(),
  useAnimatedStyle: jest.fn(),
  useSharedValue: jest.fn(),
  withRepeat: jest.fn(),
  withTiming: jest.fn(),
}));

class FakeHub implements RealtimeHub {
  isConnected = false;
  private handlers = new Map<string, Set<(...args: unknown[]) => void>>();

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

  onError(_listener: (error: RealtimeLifecycleError) => void) {
    return () => undefined;
  }

  emit(event: string, ...args: unknown[]) {
    for (const handler of this.handlers.get(event) ?? []) handler(...args);
  }
}

describe("authenticated realtime composition", () => {
  it.each([
    ["Professional", ["appointments"]],
    ["Patient", ["patient-appointments"]],
  ])(
    "invalidates %s domain caches when a notification arrives",
    (role, appointmentQueryKey) => {
      const hub = new FakeHub();
      jest
        .mocked(SignalRService)
        .mockImplementation(() => hub as unknown as SignalRService);
      const invalidateQueries = jest.fn();
      authenticatedNotificationRealtimeAdapterFactory.create({
        invalidateQueries,
      } as unknown as QueryClient);

      hub.emit("NotificationReceived", {
        id: "notification-1",
        title: "New appointment",
        message: "An appointment was created",
        type: "newAppointment",
        role,
        isRead: false,
        createdAt: "2026-08-25T10:00:00.000Z",
      });

      expect(invalidateQueries.mock.calls).toEqual([
        [{ queryKey: ["notifications"] }],
        [{ queryKey: appointmentQueryKey }],
        [{ queryKey: ["conversations"] }],
        [{ queryKey: ["reviews"] }],
        [{ queryKey: ["review-stats"] }],
      ]);
      expect(Toast.show).toHaveBeenCalledWith({
        type: "info",
        text1: "New appointment",
        text2: "An appointment was created",
      });
    },
  );
});
