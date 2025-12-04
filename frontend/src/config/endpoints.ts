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
    CHANGE_PASSWORD: "/auth/change-password",
  },
  PROFESSIONALS: {
    REGISTER_PROFESSIONAL: "/professionals/register",
    CURRENT_PROFESSIONAL: "/professionals/me",
    GET_PROFESSIONAL_BY_ID: (id: string) => `/professionals/${id}`,
    UPDATE_PROFESSIONAL: "/professionals/me",
    SETUP_SCHEDULE: "/professionals/schedule",
    GET_SCHEDULE: (professionalId: string) =>
      `/professionals/schedule?professionalId=${professionalId}`,
    GET_ALL_PROFESSIONALS: "/professionals",
    GET_PROFESSIONAL_AVAILABILITY: (professionalId: string) =>
      `/professionals/${professionalId}/availability`,
    UPLOAD_VERIFICATION_DOCUMENT: "/professionals/me/documents",
    GET_VERIFICATION_DOCUMENTS: "/professionals/me/documents",
    // Awards (current professional)
    GET_AWARDS: "/professionals/me/awards",
    CREATE_AWARD: "/professionals/me/awards",
    UPDATE_AWARD: (awardId: string) => `/professionals/me/awards/${awardId}`,
    DELETE_AWARD: (awardId: string) => `/professionals/me/awards/${awardId}`,
    // Education (current professional)
    GET_EDUCATIONS: "/professionals/me/educations",
    CREATE_EDUCATION: "/professionals/me/educations",
    UPDATE_EDUCATION: (educationId: string) =>
      `/professionals/me/educations/${educationId}`,
    DELETE_EDUCATION: (educationId: string) =>
      `/professionals/me/educations/${educationId}`,
    // Experience (current professional)
    GET_EXPERIENCES: "/professionals/me/experiences",
    CREATE_EXPERIENCE: "/professionals/me/experiences",
    UPDATE_EXPERIENCE: (experienceId: string) =>
      `/professionals/me/experiences/${experienceId}`,
    DELETE_EXPERIENCE: (experienceId: string) =>
      `/professionals/me/experiences/${experienceId}`,
    // Public professional profile (by professional ID)
    GET_PROFESSIONAL_EDUCATIONS: (professionalId: string) =>
      `/professionals/${professionalId}/educations`,
    GET_PROFESSIONAL_EXPERIENCES: (professionalId: string) =>
      `/professionals/${professionalId}/experiences`,
    GET_PROFESSIONAL_AWARDS: (professionalId: string) =>
      `/professionals/${professionalId}/awards`,
    GET_PROFESSIONAL_DOCUMENTS: (professionalId: string) =>
      `/professionals/${professionalId}/documents`,
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
    GET_MY_PROFESSIONALS: "/appointments/me/professionals",
    RESPOND_TO_APPOINTMENT: (appointmentId: string) =>
      `/appointments/${appointmentId}/respond`,
    GET_APPOINTMENT_BY_ID: (appointmentId: string) =>
      `/appointments/${appointmentId}`,
    CANCEL_APPOINTMENT: (appointmentId: string) =>
      `/appointments/${appointmentId}/cancel`,
    CANCEL_APPOINTMENT_BY_PROFESSIONAL: (appointmentId: string) =>
      `/appointments/${appointmentId}/cancel-by-professional`,
    COMPLETE_APPOINTMENT: (appointmentId: string) =>
      `/appointments/${appointmentId}/complete`,
    GET_PATIENT_PRESCRIPTIONS: "/appointments/patient/me/prescriptions",
    GET_PRESCRIPTION_BY_ID: (prescriptionId: string) =>
      `/appointments/prescriptions/${prescriptionId}`,
  },
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: "/notifications",
    MARK_NOTIFICATION_AS_READ: (notificationId: string) =>
      `/notifications/${notificationId}/mark-as-read`,
    MARK_NOTIFICATIONS_AS_READ: "/notifications/mark-as-read",
  },
  MESSAGING: {
    GET_CONVERSATIONS: "/messaging/conversations",
    GET_MESSAGES: (conversationId: string) =>
      `/messaging/conversations/${conversationId}/messages`,
    SEND_MESSAGE: (conversationId: string) =>
      `/messaging/conversations/${conversationId}/messages`,
    MARK_MESSAGES_AS_READ: (conversationId: string) =>
      `/messaging/conversations/${conversationId}/messages/read`,
    MARK_MESSAGES_AS_DELIVERED: (conversationId: string) =>
      `/messaging/conversations/${conversationId}/messages/delivered`,
    DELETE_MESSAGE: (messageId: string) => `/messaging/messages/${messageId}`,
  },
  REVIEWS: {
    SUBMIT_REVIEW: "/reviews",
    GET_PROFESSIONAL_REVIEWS: (professionalId: string) =>
      `/reviews/professional/${professionalId}`,
    GET_PROFESSIONAL_REVIEW_STATS: (professionalId: string) =>
      `/reviews/professional/${professionalId}/stats`,
    LIKE_REVIEW: (reviewId: string) => `/reviews/${reviewId}/like`,
    UNLIKE_REVIEW: (reviewId: string) => `/reviews/${reviewId}/like`,
    REPLY_TO_REVIEW: (reviewId: string) => `/reviews/${reviewId}/reply`,
    UPDATE_REVIEW: (reviewId: string) => `/reviews/${reviewId}`,
    DELETE_REVIEW: (reviewId: string) => `/reviews/${reviewId}`,
  },
} as const;
