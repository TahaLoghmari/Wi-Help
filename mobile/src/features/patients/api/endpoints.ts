export const PATIENT_ENDPOINTS = {
  REGISTER_PATIENT: "/patients/register",
  CURRENT_PATIENT: "/patients/me",
  GET_PATIENT_BY_ID: (patientId: string) => `/patients/${patientId}`,
  UPDATE_PATIENT: "/patients/me",
  GET_ALL_AS_ADMIN: "/patients/admin",
  COMPLETE_ONBOARDING: "/patients/complete-onboarding",
  GET_RELATIONSHIPS: "/relationships",
  GET_ALLERGIES: "/allergies",
  GET_CONDITIONS: "/conditions",
  GET_MEDICATIONS: "/medications",
} as const;

// Membership is displayed and queried by the patients slice.
export const PATIENT_MEMBERSHIP_ENDPOINTS = {
  GET_MY_PATIENTS: "/appointments/me/patients",
} as const;
