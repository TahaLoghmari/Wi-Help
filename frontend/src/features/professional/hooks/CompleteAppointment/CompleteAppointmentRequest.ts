export interface CompleteAppointmentRequest {
  appointmentId: string;
  prescriptionPdf: File;
  prescriptionTitle?: string;
  prescriptionNotes?: string;
}
