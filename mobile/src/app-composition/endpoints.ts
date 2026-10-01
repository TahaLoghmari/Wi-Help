// Full application endpoint contract. Feature implementation imports its own namespace.
import { AUTH_ENDPOINTS, IDENTITY_ENDPOINTS } from "@/features/auth/api";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api";
import { PATIENT_ENDPOINTS } from "@/features/patients/api";
import { APPOINTMENT_ENDPOINTS } from "@/features/appointments/api";
import { NOTIFICATION_ENDPOINTS } from "@/features/notifications/api";
import { MESSAGING_ENDPOINTS } from "@/features/messaging/api";
import { REVIEW_ENDPOINTS } from "@/features/reviews/api";
import { LOCATION_ENDPOINTS } from "@/shared/api/location/endpoints";

export const API_ENDPOINTS = {
  AUTH: { ...AUTH_ENDPOINTS, ...LOCATION_ENDPOINTS },
  IDENTITY: IDENTITY_ENDPOINTS,
  PROFESSIONALS: PROFESSIONAL_ENDPOINTS,
  PATIENTS: PATIENT_ENDPOINTS,
  APPOINTMENTS: APPOINTMENT_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  MESSAGING: MESSAGING_ENDPOINTS,
  REVIEWS: REVIEW_ENDPOINTS,
} as const;
