import type { NotificationDto } from "@/features/notifications";

export const mapNotificationDates = (notification: NotificationDto) => ({
  ...notification,
  createdAt: new Date(notification.createdAt),
});
