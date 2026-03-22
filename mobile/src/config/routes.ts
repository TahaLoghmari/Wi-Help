export const ROUTE_PATHS = {
  WELCOME: "/" as const,
  AUTH: {
    LOGIN: "/(auth)/login" as const,
    REGISTER: "/(auth)/register" as const,
  },
  PATIENT: {
    APPOINTMENTS: "/(patient)/appointments" as const,
  },
  PROFESSIONAL: {
    APPOINTMENTS: "/(professional)/appointments" as const,
    PATIENTS: "/(professional)/patients" as const,
    SCHEDULE: "/(professional)/schedule" as const,
    MESSAGES: "/(professional)/messages" as const,
    NOTIFICATIONS: "/(professional)/notifications" as const,
    MORE: "/(professional)/more" as const,
    PATIENT_PROFILE_PATHNAME: "/(professional)/patient/[id]" as const,
    APPOINTMENT_DETAIL_PATHNAME: "/(professional)/appointment/[id]" as const,
  },
} as const;
