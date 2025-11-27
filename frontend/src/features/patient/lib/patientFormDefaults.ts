import type { PatientDto } from "@/features/patient";

export function bookAppointmentFormDefaults() {
  return {
    startDate: "",
    endDate: "",
    price: 0,
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
    medicalInfo: patient.medicalInfo,
    bio: patient.bio,
    profilePicture: undefined,
  };
}
