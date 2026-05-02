import { type Address } from "@/types/enums.types";

export interface PatientDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  profilePictureUrl?: string;
}

export interface LookupItem {
  id: string;
  key: string;
}

export interface EmergencyContact {
  fullName: string;
  phoneNumber: string;
  relationshipId: string | null;
}

export type MobilityStatus = "Normal" | "Limited" | "Immobile";

export interface FullPatientDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  profilePictureUrl?: string | null;
  bio?: string | null;
  mobilityStatus?: MobilityStatus | null;
  allergies: LookupItem[];
  conditions: LookupItem[];
  medications: LookupItem[];
  emergencyContact: EmergencyContact;
}
