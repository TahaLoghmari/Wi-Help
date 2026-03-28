export const appointmentKeys = {
  all: ["professional-appointments"] as const,
  detail: (id: string) => ["appointment", id] as const,
};
