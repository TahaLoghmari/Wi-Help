import type { InfiniteData } from "@tanstack/react-query";
import type { PaginationResultDto } from "@/types/enums.types";
import type { NotificationDto } from "./notification.types";

export type NotificationsData = InfiniteData<
  PaginationResultDto<NotificationDto>
>;

export function markNotificationRead(
  data: NotificationsData | undefined,
  id: string,
): NotificationsData | undefined {
  if (!data) return undefined;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    })),
  };
}

export function markAllNotificationsRead(
  data: NotificationsData | undefined,
): NotificationsData | undefined {
  if (!data) return undefined;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => ({ ...item, isRead: true })),
    })),
  };
}

export function hasUnreadNotifications(
  data: NotificationsData | undefined,
): boolean {
  return (
    data?.pages.some((page) => page.items.some((item) => !item.isRead)) ?? false
  );
}
