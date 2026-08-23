namespace Modules.Notifications.PublicApi.Contracts;

public enum NotificationType
{
    newAppointment,
    appointmentAccepted,
    appointmentRejected,
    appointmentCancelled,
    appointmentCompleted,
    newPrescription,
    newMessage,
    accountStatusUpdated,
    documentStatusUpdated,
    appointmentStatusUpdated,
    newReview
}
