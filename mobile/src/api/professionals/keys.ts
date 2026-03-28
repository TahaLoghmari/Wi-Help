export const professionalKeys = {
  currentProfessional: ["currentProfessional"] as const,
  services: (specializationId: string) =>
    ["services", specializationId] as const,
  scheduleAll: ["schedule"] as const,
  schedule: (professionalId: string) => ["schedule", professionalId] as const,
  availability: ["professionalAvailability"] as const,
};
