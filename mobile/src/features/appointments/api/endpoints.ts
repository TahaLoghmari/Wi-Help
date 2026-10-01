export const APPOINTMENT_ENDPOINTS = {
  GET_PATIENT_APPOINTMENTS: "/appointments/patient/me",
  GET_PROFESSIONAL_APPOINTMENTS: "/appointments/professional/me",
  BOOK_APPOINTMENT: "/appointments",
  GET_MY_PATIENTS: "/appointments/me/patients",
  GET_MY_PROFESSIONALS: "/appointments/me/professionals",
  RESPOND_TO_APPOINTMENT: (appointmentId: string) =>
    `/appointments/${appointmentId}/respond`,
  GET_APPOINTMENT_BY_ID: (appointmentId: string) =>
    `/appointments/${appointmentId}`,
  CANCEL_APPOINTMENT: (appointmentId: string) =>
    `/appointments/${appointmentId}/cancel`,
  CANCEL_APPOINTMENT_BY_PROFESSIONAL: (appointmentId: string) =>
    `/appointments/${appointmentId}/cancel-by-professional`,
  COMPLETE_APPOINTMENT: (appointmentId: string) =>
    `/appointments/${appointmentId}/complete`,
  GET_PATIENT_PRESCRIPTIONS: "/appointments/patient/me/prescriptions",
  GET_PRESCRIPTION_BY_ID: (prescriptionId: string) =>
    `/appointments/prescriptions/${prescriptionId}`,
  GET_ALL_AS_ADMIN: "/appointments/admin/all",
  UPDATE_STATUS_AS_ADMIN: (appointmentId: string) =>
    `/appointments/${appointmentId}/admin/status`,
  GET_PRESCRIPTIONS_AS_ADMIN: "/appointments/admin/prescriptions",
  DELETE_PRESCRIPTION_AS_ADMIN: (prescriptionId: string) =>
    `/appointments/admin/prescriptions/${prescriptionId}`,
} as const;
