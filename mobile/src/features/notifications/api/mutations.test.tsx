import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { api } from "@/shared/api/api-client";
import { notificationKeys } from "./keys";
import type { NotificationsData } from "./notification-cache";
import { NotificationType } from "./notification.types";
import { useMarkNotificationAsRead } from "./mark-notification-as-read";
import { useMarkAllNotificationsAsRead } from "./mark-all-notifications-as-read";

jest.mock("@/shared/api/api-client", () => ({ api: { post: jest.fn() } }));

function setup() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  const data: NotificationsData = {
    pageParams: [1],
    pages: [
      {
        items: [
          {
            id: "notification-1",
            title: "Appointment",
            message: "Confirmed",
            type: NotificationType.appointmentAccepted,
            isRead: false,
            createdAt: "2026-01-01T12:00:00Z",
          },
        ],
        page: 1,
        pageSize: 20,
        totalCount: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    ],
  };
  client.setQueryData(notificationKeys.all, data);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, data, wrapper };
}

describe("notification mutation cache contracts", () => {
  beforeEach(() => jest.clearAllMocks());

  it("optimistically marks one read, then restores the snapshot on failure", async () => {
    const { client, data, wrapper } = setup();
    let rejectRequest!: (error: Error) => void;
    jest.mocked(api.post).mockReturnValue(
      new Promise((_, reject) => {
        rejectRequest = reject;
      }),
    );
    const cancel = jest.spyOn(client, "cancelQueries");
    const invalidate = jest.spyOn(client, "invalidateQueries");
    const { result, unmount } = await renderHook(
      () => useMarkNotificationAsRead(),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate("notification-1");
    });
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(
        "/notifications/notification-1/mark-as-read",
      ),
    );
    expect(cancel).toHaveBeenCalledWith({ queryKey: notificationKeys.all });
    expect(
      client.getQueryData<NotificationsData>(notificationKeys.all)?.pages[0]
        .items[0].isRead,
    ).toBe(true);
    expect(data.pages[0].items[0].isRead).toBe(false);

    await act(async () => {
      rejectRequest(new Error("offline"));
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(client.getQueryData(notificationKeys.all)).toEqual(data);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: notificationKeys.all });
    unmount();
    client.clear();
  });

  it("marks all read with the unchanged endpoint and pagination shape", async () => {
    const { client, data, wrapper } = setup();
    jest.mocked(api.post).mockResolvedValue(undefined);
    const invalidate = jest.spyOn(client, "invalidateQueries");
    const { result, unmount } = await renderHook(
      () => useMarkAllNotificationsAsRead(),
      { wrapper },
    );
    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(api.post).toHaveBeenCalledWith("/notifications/mark-as-read");
    const updated = client.getQueryData<NotificationsData>(
      notificationKeys.all,
    )!;
    expect(updated.pageParams).toEqual(data.pageParams);
    expect(updated.pages[0]).toEqual({
      ...data.pages[0],
      items: [{ ...data.pages[0].items[0], isRead: true }],
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: notificationKeys.all });
    unmount();
    client.clear();
  });
});
