import type { NotificationDto } from "@/features/notifications";
import { NotificationType } from "@/features/notifications";

export const mapNotificationDates = (notification: NotificationDto) => ({
  ...notification,
  createdAt: new Date(notification.createdAt),
});

export const isAppointmentNotification = (type: string): boolean => {
  return [
    NotificationType.newAppointment,
    NotificationType.appointmentAccepted,
    NotificationType.appointmentRejected,
    NotificationType.appointmentCancelled,
    NotificationType.appointmentCompleted,
    NotificationType.newPrescription,
  ].includes(type as any);
};

export const isMessageNotification = (type: string): boolean => {
  return type === NotificationType.newMessage;
};
