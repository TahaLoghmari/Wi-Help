import type { PatientDto } from "@/features/patient";

export function bookAppointmentFormDefaults() {
  return {
    startDate: "",
    endDate: "",
    price: 0,
    urgency: "Medium" as const,
    notes: "",
  };
}

export function ProfileAndBioFormDefaults(patient: PatientDto) {
  return {
    firstName: patient.firstName,
    lastName: patient.lastName,
    phoneNumber: patient.phoneNumber,
    address: patient.address,
    emergencyContact: patient.emergencyContact,
    mobilityStatus: patient.mobilityStatus ?? "Normal",
    allergyIds: patient.allergies?.map((a) => a.id) ?? [],
    conditionIds: patient.conditions?.map((c) => c.id) ?? [],
    medicationIds: patient.medications?.map((m) => m.id) ?? [],
    bio: patient.bio,
    profilePicture: undefined,
  };
}
