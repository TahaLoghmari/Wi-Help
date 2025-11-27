import type { Address, EmergencyContact } from "@/features/auth";
import type { MedicalInfo } from "@/features/patient";

export interface GetPatientDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  bio?: string;
  profilePictureUrl?: string;
}
