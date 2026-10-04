export const appointmentKeys = {
  all: ["appointments"] as const,
  patientList: ["patient-appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  professionalList: () => [...appointmentKeys.lists(), "professional"] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};
