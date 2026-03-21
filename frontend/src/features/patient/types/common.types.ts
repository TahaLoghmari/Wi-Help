import type { Address, EmergencyContact } from "@/features/auth";
import type { MobilityStatus } from "./enums.types";
import type { LookupDto } from "@/features/patient/hooks/LookupDto";
import type { profileAndBioFormSchema } from "@/features/professional";
import type z from "zod";

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
  emergencyContact: EmergencyContact;
  mobilityStatus?: MobilityStatus;
  allergies: LookupDto[];
  conditions: LookupDto[];
  medications: LookupDto[];
  bio?: string;
  profilePictureUrl?: string;
}

export type UpdatePatientDto = z.infer<typeof profileAndBioFormSchema>;
