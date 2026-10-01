import type { InfiniteData } from "@tanstack/react-query";
import type { PaginationResultDto } from "@/shared/api/enums.types";
import type { NotificationDto } from "./notification.types";
import {
  hasUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification-cache";

type NotificationsData = InfiniteData<PaginationResultDto<NotificationDto>>;

const unreadNotification: NotificationDto = {
  id: "notification-1",
  title: "New appointment",
  message: "An appointment was created",
  type: "newAppointment",
  isRead: false,
  createdAt: "2026-08-25T10:00:00.000Z",
};

const readNotification: NotificationDto = {
  id: "notification-2",
  title: "Appointment accepted",
  message: "An appointment was accepted",
  type: "appointmentAccepted",
  isRead: true,
  createdAt: "2026-08-24T10:00:00.000Z",
};

function createNotificationsData(): NotificationsData {
  return {
    pages: [
      {
        items: [unreadNotification],
        page: 1,
        pageSize: 1,
        totalCount: 2,
        totalPages: 2,
        hasPreviousPage: false,
        hasNextPage: true,
      },
      {
        items: [readNotification],
        page: 2,
        pageSize: 1,
        totalCount: 2,
        totalPages: 2,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    ],
    pageParams: [1, 2],
  };
}

describe("notification cache transformations", () => {
  it("marks one notification read without changing pagination or the input", () => {
    const data = createNotificationsData();
    const original = structuredClone(data);

    const result = markNotificationRead(data, unreadNotification.id);

    expect(result?.pages[0]?.items[0]?.isRead).toBe(true);
    expect(result?.pages[1]?.items[0]).toBe(readNotification);
    expect(result?.pages.map(({ items: _items, ...page }) => page)).toEqual(
      data.pages.map(({ items: _items, ...page }) => page),
    );
    expect(result?.pageParams).toBe(data.pageParams);
    expect(data).toEqual(original);
  });

  it("marks every notification read without changing pagination or the input", () => {
    const data = createNotificationsData();
    const original = structuredClone(data);

    const result = markAllNotificationsRead(data);

    expect(result?.pages.flatMap((page) => page.items)).toEqual([
      { ...unreadNotification, isRead: true },
      { ...readNotification, isRead: true },
    ]);
    expect(result?.pages.map(({ items: _items, ...page }) => page)).toEqual(
      data.pages.map(({ items: _items, ...page }) => page),
    );
    expect(result?.pageParams).toBe(data.pageParams);
    expect(data).toEqual(original);
  });

  it("preserves an undefined cache", () => {
    expect(
      markNotificationRead(undefined, unreadNotification.id),
    ).toBeUndefined();
    expect(markAllNotificationsRead(undefined)).toBeUndefined();
  });
});

describe("hasUnreadNotifications", () => {
  it("selects whether any page contains an unread notification", () => {
    expect(hasUnreadNotifications(createNotificationsData())).toBe(true);
    expect(
      hasUnreadNotifications(markAllNotificationsRead(createNotificationsData())),
    ).toBe(false);
    expect(hasUnreadNotifications(undefined)).toBe(false);
  });
});
