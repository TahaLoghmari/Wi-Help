import type { Address, EmergencyContact } from "@/features/auth";
import type { MobilityStatus } from "@/features/patient/types/enums.types";
import type { LookupDto } from "../LookupDto";

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
  mobilityStatus?: MobilityStatus;
  allergies: LookupDto[];
  conditions: LookupDto[];
  medications: LookupDto[];
  bio?: string;
  profilePictureUrl?: string;
  distanceKm?: number | null;
}
