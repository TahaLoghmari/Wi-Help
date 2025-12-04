export const NotificationType = {
  newAppointment: "newAppointment",
  appointmentAccepted: "appointmentAccepted",
  appointmentRejected: "appointmentRejected",
  appointmentCancelled: "appointmentCancelled",
  appointmentCompleted: "appointmentCompleted",
  newPrescription: "newPrescription",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
