export const PROFESSIONAL_ENDPOINTS = {
  REGISTER_PROFESSIONAL: "/professionals/register",
  CURRENT_PROFESSIONAL: "/professionals/me",
  GET_SERVICES_BY_SPECIALIZATION: (specializationId: string) =>
    `/specializations/${specializationId}/services`,
  GET_SPECIALIZATIONS: "/specializations",
  GET_PROFESSIONAL_BY_ID: (id: string) => `/professionals/${id}`,
  UPDATE_PROFESSIONAL: "/professionals/me",
  SETUP_SCHEDULE: "/professionals/schedule",
  GET_SCHEDULE: (professionalId: string) =>
    `/professionals/schedule?professionalId=${professionalId}`,
  GET_ALL_PROFESSIONALS: "/professionals",
  GET_ALL_AS_ADMIN: "/professionals/admin",
  UPDATE_ACCOUNT_STATUS: (professionalId: string) =>
    `/professionals/${professionalId}/status`,
  UPDATE_DOCUMENT_STATUS_AS_ADMIN: (documentId: string) =>
    `/professionals/admin/documents/${documentId}/status`,
  GET_PROFESSIONAL_AVAILABILITY: (professionalId: string) =>
    `/professionals/${professionalId}/availability`,
  UPLOAD_VERIFICATION_DOCUMENT: "/professionals/me/documents",
  GET_VERIFICATION_DOCUMENTS: "/professionals/me/documents",
  COMPLETE_ONBOARDING: "/professionals/complete-onboarding",
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
  GET_VERIFICATION_DOCUMENTS_AS_ADMIN: "/professionals/admin/documents",
} as const;
