import type { NotificationType } from "@/features/notifications";

export interface GetNotificationsDto {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
