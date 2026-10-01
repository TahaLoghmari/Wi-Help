import { AUTH_PROTOCOL_ENDPOINTS } from "@/shared/api/auth-endpoints";

export const AUTH_ENDPOINTS = {
  ...AUTH_PROTOCOL_ENDPOINTS,
  LOGOUT: "/auth/logout",
  CONFIRM_EMAIL: "/auth/confirm-email",
  CURRENT_USER: "/auth/me",
  GOOGLE_AUTHORIZE: "/auth/google/authorize",
  GOOGLE_CALLBACK: "/auth/google/callback",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  SEND_CONFIRMATION_EMAIL: "/auth/send-confirmation-email",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

export const IDENTITY_ENDPOINTS = {
  BAN_USER: (userId: string) => `/identity/users/${userId}/ban`,
  ADMIN_CHANGE_PASSWORD: (userId: string) =>
    `/identity/users/${userId}/password`,
  UPDATE_LOCATION: "/users/location",
} as const;
