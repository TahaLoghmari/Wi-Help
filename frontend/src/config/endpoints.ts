export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    CONFIRM_EMAIL: "/auth/confirm-email",
    CURRENT_USER: "/auth/me",
    GOOGLE_AUTHORIZE: "/auth/google/authorize",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    SEND_CONFIRMATION_EMAIL: "/auth/send-confirmation-email",
  },
  PROFESSIONALS: {
    REGISTER_PROFESSIONAL: "/professionals/register",
    CURRENT_PROFESSIONAL: "/professionals/me",
    GET_PROFESSIONAL_BY_ID: (id: string) => `/professionals/${id}`,
    UPDATE_PROFESSIONAL: "/professionals/me",
    SETUP_SCHEDULE: "/professionals/schedule",
    GET_SCHEDULE: "/professionals/schedule",
    GET_ALL_PROFESSIONALS: "/professionals",
    GET_PROFESSIONAL_AVAILABILITY: (professionalId: string) =>
      `/professionals/${professionalId}/availability`,
  },
  PATIENTS: {
    REGISTER_PATIENT: "/patients/register",
    CURRENT_PATIENT: "/patients/me",
    GET_PATIENT_BY_ID: (patientId: string) => `/patients/${patientId}`,
    UPDATE_PATIENT: "/patients/me",
  },
  APPOINTMENTS: {
    GET_PATIENT_APPOINTMENTS: "/appointments/patient/me",
    GET_PROFESSIONAL_APPOINTMENTS: "/appointments/professional/me",
    BOOK_APPOINTMENT: "/appointments",
    GET_MY_PATIENTS: "/appointments/me/patients",
    RESPOND_TO_APPOINTMENT: (appointmentId: string) =>
      `/appointments/${appointmentId}/respond`,
    GET_APPOINTMENT_BY_ID: (appointmentId: string) =>
      `/appointments/${appointmentId}`,
  },
} as const;
