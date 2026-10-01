import { HubConnectionState } from "@microsoft/signalr";
import type { QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { NotificationType } from "@/features/notifications/api";
import { SignalRService } from "@/shared/api/signalr";
import type {
  RealtimeHub,
  RealtimeLifecycleError,
} from "@/shared/api/signalr/realtime-types";
import {
  authenticatedNotificationRealtimeAdapterFactory,
  createAuthenticatedNotificationRealtimeAdapterFactory,
} from "./authenticated-realtime-provider";

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));
jest.mock("@/shared/api/signalr", () => ({ SignalRService: jest.fn() }));
jest.mock("@/features/messaging/realtime", () => ({
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
  function setup() {
    const hub = new FakeHub();
    const createHub = jest.fn(() => hub);
    const invalidateQueries = jest.fn();
    createAuthenticatedNotificationRealtimeAdapterFactory(createHub).create({
      invalidateQueries,
    } as unknown as QueryClient);
    return { createHub, hub, invalidateQueries };
  }

  function emitNotification(hub: FakeHub, type: string, role = "Professional") {
    hub.emit("NotificationReceived", {
      id: "notification-1",
      title: "Notification title",
      message: "Notification message",
      type,
      role,
      isRead: false,
      createdAt: "2026-08-25T10:00:00.000Z",
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("constructs the notification hub through the injected factory", () => {
    const { createHub } = setup();

    expect(createHub).toHaveBeenCalledTimes(1);
  });

  it.each([
    NotificationType.newAppointment,
    NotificationType.appointmentAccepted,
    NotificationType.appointmentRejected,
    NotificationType.appointmentCancelled,
    NotificationType.appointmentCompleted,
    NotificationType.appointmentStatusUpdated,
  ])("invalidates only professional appointments for %s", (type) => {
    const { hub, invalidateQueries } = setup();

    emitNotification(hub, type);

    expect(invalidateQueries.mock.calls).toEqual([
      [{ queryKey: ["notifications"] }],
      [{ queryKey: ["appointments"] }],
    ]);
  });

  it("invalidates only patient appointments for appointment notifications", () => {
    const { hub, invalidateQueries } = setup();

    emitNotification(hub, NotificationType.appointmentAccepted, "Patient");

    expect(invalidateQueries.mock.calls).toEqual([
      [{ queryKey: ["notifications"] }],
      [{ queryKey: ["patient-appointments"] }],
    ]);
  });

  it("invalidates only conversations for a new message", () => {
    const { hub, invalidateQueries } = setup();

    emitNotification(hub, NotificationType.newMessage);

    expect(invalidateQueries.mock.calls).toEqual([
      [{ queryKey: ["notifications"] }],
      [{ queryKey: ["conversations"] }],
    ]);
  });

  it("invalidates only reviews and review stats for a new review", () => {
    const { hub, invalidateQueries } = setup();

    emitNotification(hub, NotificationType.newReview);

    expect(invalidateQueries.mock.calls).toEqual([
      [{ queryKey: ["notifications"] }],
      [{ queryKey: ["reviews"] }],
      [{ queryKey: ["review-stats"] }],
    ]);
  });

  it.each([
    NotificationType.newPrescription,
    NotificationType.accountStatusUpdated,
    NotificationType.documentStatusUpdated,
  ])("invalidates only notifications for unrelated type %s", (type) => {
    const { hub, invalidateQueries } = setup();

    emitNotification(hub, type);

    expect(invalidateQueries.mock.calls).toEqual([
      [{ queryKey: ["notifications"] }],
    ]);
  });

  it("displays unknown notification types without unrelated invalidation", () => {
    const { hub, invalidateQueries } = setup();

    emitNotification(hub, "futureNotificationType");

    expect(invalidateQueries.mock.calls).toEqual([
      [{ queryKey: ["notifications"] }],
    ]);
    expect(Toast.show).toHaveBeenCalledWith({
      type: "info",
      text1: "Notification title",
      text2: "Notification message",
    });
  });

  it("retains the production notification factory export", () => {
    const hub = new FakeHub();
    jest
      .mocked(SignalRService)
      .mockImplementation(() => hub as unknown as SignalRService);

    authenticatedNotificationRealtimeAdapterFactory.create({
      invalidateQueries: jest.fn(),
    } as unknown as QueryClient);

    expect(SignalRService).toHaveBeenCalledWith({
      hubPath: "/hubs/notifications",
    });
  });
});
