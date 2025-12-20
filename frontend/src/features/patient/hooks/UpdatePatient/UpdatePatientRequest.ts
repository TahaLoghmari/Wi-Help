import type { Address, EmergencyContact } from "@/features/auth";
import type { MedicalInfo } from "@/features/patient";

export interface UpdatePatientRequest {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  address?: Address | null;
  emergencyContact?: EmergencyContact | null;
  medicalinfo?: MedicalInfo | null;
  bio?: string | null;
  profilePicture?: File | null;
}
