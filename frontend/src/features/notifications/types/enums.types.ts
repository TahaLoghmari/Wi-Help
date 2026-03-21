export const NotificationType = {
  newAppointment: "newAppointment",
  appointmentAccepted: "appointmentAccepted",
  appointmentRejected: "appointmentRejected",
  appointmentCancelled: "appointmentCancelled",
  appointmentCompleted: "appointmentCompleted",
  newPrescription: "newPrescription",
  newMessage: "newMessage",
  newReview: "newReview",
  accountStatusUpdated: "accountStatusUpdated",
  documentStatusUpdated: "documentStatusUpdated",
  appointmentStatusUpdated: "appointmentStatusUpdated",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
