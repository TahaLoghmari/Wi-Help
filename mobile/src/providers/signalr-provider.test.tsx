import { HubConnectionState } from "@microsoft/signalr";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { useCurrentUser } from "@/entities/session";
import { useRealtimeAdapters } from "@/lib/signalr/realtime-context";
import type {
  MessagingRealtimeAdapter,
  RealtimeAdapter,
  RealtimeAdapterFactory,
} from "@/lib/signalr/realtime-types";
import { SignalRProvider } from "./signalr-provider";

jest.mock("@/entities/session", () => ({
  useCurrentUser: jest.fn(),
}));

function createAdapter(): RealtimeAdapter {
  return {
    start: jest.fn(async () => undefined),
    stop: jest.fn(async () => undefined),
    getSnapshot: () => ({
      connectionState: HubConnectionState.Disconnected,
      error: null,
    }),
    subscribe: () => () => undefined,
  };
}

function createMessagingAdapter(): MessagingRealtimeAdapter {
  return {
    ...createAdapter(),
    getSnapshot: () => ({
      connectionState: HubConnectionState.Disconnected,
      error: null,
      onlineUserIds: new Set(),
      typingUserIds: new Map(),
    }),
    joinConversation: jest.fn(),
    leaveConversation: jest.fn(),
    startTyping: jest.fn(),
    stopTyping: jest.fn(),
    clearTypingUsers: jest.fn(),
  };
}

function factory<TAdapter extends RealtimeAdapter>(
  adapter: TAdapter,
): RealtimeAdapterFactory<TAdapter> {
  return { create: () => adapter };
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

describe("SignalRProvider", () => {
  beforeEach(() => {
    jest.mocked(useCurrentUser).mockReturnValue({
      data: { id: "user-1" },
      isLoading: false,
    } as unknown as ReturnType<typeof useCurrentUser>);
  });

  it("exposes both lifecycle adapters to provider consumers", async () => {
    const messagingAdapter = createMessagingAdapter();
    const notificationAdapter = createAdapter();
    let contextValue:
      | ReturnType<typeof useRealtimeAdapters>
      | undefined;

    function Consumer() {
      contextValue = useRealtimeAdapters();
      return null;
    }

    await render(
      <SignalRProvider
        messagingAdapterFactory={factory(messagingAdapter)}
        notificationAdapterFactory={factory(notificationAdapter)}
      >
        <Consumer />
      </SignalRProvider>,
      { wrapper: Wrapper },
    );

    expect(contextValue).toEqual({ messagingAdapter, notificationAdapter });
  });

  it("handles adapter start and stop rejections", async () => {
    const messagingAdapter = createMessagingAdapter();
    const notificationAdapter = createAdapter();
    const messagingStart = new Promise<void>(() => undefined);
    const notificationStart = new Promise<void>(() => undefined);
    const messagingStop = new Promise<void>(() => undefined);
    const notificationStop = new Promise<void>(() => undefined);
    const catches = [
      jest.spyOn(messagingStart, "catch"),
      jest.spyOn(notificationStart, "catch"),
      jest.spyOn(messagingStop, "catch"),
      jest.spyOn(notificationStop, "catch"),
    ];
    jest.mocked(messagingAdapter.start).mockReturnValue(messagingStart);
    jest.mocked(notificationAdapter.start).mockReturnValue(notificationStart);
    jest.mocked(messagingAdapter.stop).mockReturnValue(messagingStop);
    jest.mocked(notificationAdapter.stop).mockReturnValue(notificationStop);

    const view = await render(
      <SignalRProvider
        messagingAdapterFactory={factory(messagingAdapter)}
        notificationAdapterFactory={factory(notificationAdapter)}
      >
        {null}
      </SignalRProvider>,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(catches[0]).toHaveBeenCalledTimes(1);
      expect(catches[1]).toHaveBeenCalledTimes(1);
    });

    await view.unmount();

    expect(catches[2]).toHaveBeenCalledTimes(1);
    expect(catches[3]).toHaveBeenCalledTimes(1);
  });
});
