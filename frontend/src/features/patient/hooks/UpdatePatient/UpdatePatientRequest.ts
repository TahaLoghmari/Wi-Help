import type { Address, EmergencyContact } from "@/features/auth";
import type { MobilityStatus } from "@/features/patient/types/enums.types";

export interface UpdatePatientRequest {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  address?: Address | null;
  emergencyContact?: EmergencyContact | null;
  mobilityStatus?: MobilityStatus | null;
  allergyIds?: string[] | null;
  conditionIds?: string[] | null;
  medicationIds?: string[] | null;
  bio?: string | null;
  profilePicture?: File | null;
}
