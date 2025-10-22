// These are the frontend routes

export const ROUTE_PATHS = {
  ROOT: "/",

  AUTH: {
    INDEX: "/auth",
    LOGIN: "/auth/login",
    EMAIL_VERIFICATION: "/auth/email-verification",
  },

  APP: {
    INDEX: "/app",
  },
} as const;
