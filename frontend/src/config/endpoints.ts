export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    GOOGLE_AUTHORIZE: "/auth/google/authorize",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    SEND_CONFIRMATION_EMAIL: "/auth/send-confirmation-email",
    CURRENT_USER: "/auth/me",
  },
} as const;
