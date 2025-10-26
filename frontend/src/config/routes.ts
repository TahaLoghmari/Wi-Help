// These are the frontend routes

export const ROUTE_PATHS = {
  ROOT: "/",

  AUTH: {
    ROOT: "/auth",
    INDEX: "/auth/",
    LOGIN: "/auth/login",
    REGISTER_PATIENT: "/auth/register-patient",
    REGISTER_PROFESSIONAL: "/auth/register-professional",
    EMAIL_VERIFICATION: "/auth/email-verification",
    EMAIL_VERIFIED: "/auth/email-verified",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  APP: {
    INDEX: "/app",
  },
} as const;
