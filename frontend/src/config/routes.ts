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
    APPOINTMENTS: "/professional/appointments",
    MYPATIENTS: "/professional/my-patients",
    SCHEDULETIMINGS: "/professional/schedule-timings",
    INVOICES: "/professional/invoices",
    MESSAGES: "/professional/messages",
    NOTIFICATIONS: "/professional/notifications",
    SETTINGS: "/professional/settings",
    PROFILE: "/professional/profile",
    PATIENT_PROFILE: "/professional/patient/$patientId",
  },

  PATIENT: {
    ROOT: "/patient",
    INDEX: "/patient/",
    APPOINTMENTS: "/patient/appointments",
    BILLING: "/patient/billing",
    FINDPROFESSIONAL: "/patient/find-professional",
    PROFESSIONAL_PROFILE: "/patient/professional/$professionalId",
    MEDICALRECORDS: "/patient/medical-records",
    MESSAGES: "/patient/messages",
    MYPROFESSIONALS: "/patient/my-professionals",
    PRESCRIPTIONS: "/patient/prescriptions",
    SETTINGS: "/patient/settings",
    PROFILE: "/patient/profile",
    BOOK: "/patient/book/$professionalId",
    BOOK_SUCCESS: "/patient/book/success",
    NOTIFICATIONS: "/patient/notifications",
  },
} as const;
