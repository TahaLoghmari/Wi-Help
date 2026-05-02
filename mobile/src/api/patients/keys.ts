export const patientKeys = {
  allergies: ["allergies"] as const,
  conditions: ["conditions"] as const,
  medications: ["medications"] as const,
  professionalPatients: ["professional-patients"] as const,
  currentPatient: ["current-patient"] as const,
  patientById: (id: string) => ["patient", id] as const,
};
