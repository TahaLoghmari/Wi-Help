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
    medicalInfo: patient.medicalInfo
      ? {
          chronicConditions: patient.medicalInfo.chronicConditions ?? [],
          allergies: patient.medicalInfo.allergies ?? [],
          medications: patient.medicalInfo.medications ?? [],
          mobilityStatus: patient.medicalInfo.mobilityStatus ?? "Normal",
        }
      : undefined,
    bio: patient.bio,
    profilePicture: undefined,
  };
}
