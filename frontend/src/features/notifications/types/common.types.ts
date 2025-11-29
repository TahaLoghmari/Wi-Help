import type { NotificationType } from "@/features/notifications";

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  role: string;
  isRead: boolean;
  createdAt: string;
}
