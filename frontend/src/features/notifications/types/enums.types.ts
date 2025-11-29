export const NotificationType = {
  newAppointment: "newAppointment",
  appointmentAccepted: "appointmentAccepted",
  appointmentRejected: "appointmentRejected",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
