import type { Address, EmergencyContact } from "@/features/auth";
import type { LookupDto } from "../LookupDto";
import type { MobilityStatus } from "@/features/patient/types/enums.types";

export interface GetCurrentPatientDto {
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
}
