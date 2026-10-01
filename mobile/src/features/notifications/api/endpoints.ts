export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS: "/notifications",
  MARK_NOTIFICATION_AS_READ: (notificationId: string) =>
    `/notifications/${notificationId}/mark-as-read`,
  MARK_NOTIFICATIONS_AS_READ: "/notifications/mark-as-read",
} as const;
