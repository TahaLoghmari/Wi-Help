export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    GOOGLE_AUTHORIZE: "/auth/google/authorize",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    SEND_CONFIRMATION_EMAIL: "/auth/send-confirmation-email",
    CURRENT_USER: "/auth/me",
  },
  PROFESSIONALS: {
    REGISTER_PROFESSIONAL: "/professionals/register",
    CURRENT_PROFESSIONAL: "/professionals/me",
    GET_PROFESSIONAL_BY_ID: "/professionals", // + /:id
    UPDATE_PROFESSIONAL: "/professionals/me",
    SETUP_SCHEDULE: "/professionals/schedule",
    GET_SCHEDULE: "/professionals/schedule",
    GET_ALL_PROFESSIONALS: "/professionals",
  },
  PATIENTS: {
    REGISTER_PATIENT: "/patients/register",
    CURRENT_PATIENT: "/patients/me",
    UPDATE_PATIENT: "/patients/me",
    GET_PROFESSIONAL_AVAILABILITY: (professionalId: string) =>
      `/professionals/${professionalId}/availability`,
    BOOK_APPOINTMENT: "/patients/appointments/book",
  },
  APPOINTMENTS: {
    GET_ALL: "/appointments",
  },
} as const;
