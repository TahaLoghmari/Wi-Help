import type { Address, EmergencyContact } from "@/features/auth";
import type { MedicalInfo } from "@/features/patient";

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  medicalinfo?: MedicalInfo;
  bio?: string;
  profilePicture?: File;
}
