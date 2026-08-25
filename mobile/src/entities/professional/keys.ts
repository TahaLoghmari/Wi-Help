export const professionalKeys = {
  currentProfessional: ["currentProfessional"] as const,
  details: () => ["professional"] as const,
  detail: (id: string | undefined) =>
    [...professionalKeys.details(), id] as const,
  awards: () => ["professionalAwards"] as const,
  awardsByProfessional: (professionalId: string | undefined) =>
    [...professionalKeys.awards(), professionalId] as const,
  documents: () => ["professionalDocuments"] as const,
  documentsByProfessional: (professionalId: string | undefined) =>
    [...professionalKeys.documents(), professionalId] as const,
  educations: () => ["professionalEducations"] as const,
  educationsByProfessional: (professionalId: string | undefined) =>
    [...professionalKeys.educations(), professionalId] as const,
  experiences: () => ["professionalExperiences"] as const,
  experiencesByProfessional: (professionalId: string | undefined) =>
    [...professionalKeys.experiences(), professionalId] as const,
  specializations: ["specializations"] as const,
  services: (specializationId: string) =>
    ["services", specializationId] as const,
  scheduleAll: ["schedule"] as const,
  schedule: (professionalId: string) => ["schedule", professionalId] as const,
  availability: ["professionalAvailability"] as const,
};
