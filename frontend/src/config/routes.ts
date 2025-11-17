// These are the frontend routes

export const ROUTE_PATHS = {
  ROOT: "/",

  AUTH: {
    ROOT: "/auth",
    INDEX: "/auth/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    EMAIL_VERIFICATION: "/auth/email-verification",
    EMAIL_VERIFIED: "/auth/email-verified",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  PROFESSIONAL: {
    ROOT: "/professional",
    INDEX: "/professional/",
  },
} as const;
