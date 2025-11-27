import type { Address, EmergencyContact } from "@/features/auth";
import type { MedicalInfo } from "./enums.types";
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
  address?: Address;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  bio?: string;
  profilePictureUrl?: string;
}

export type UpdatePatientDto = z.infer<typeof profileAndBioFormSchema>;
