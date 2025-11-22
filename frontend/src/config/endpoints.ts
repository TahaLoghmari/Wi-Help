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
    UPDATE_PROFESSIONAL: "/professionals/me",
  },
  PATIENTS: {
    REGISTER_PATIENT: "/patients/register",
    CURRENT_PATIENT: "/patients/me",
  },
} as const;
