import { type Address } from "@/features/auth/types/api.types";
import type { profileAndBioFormSchema } from "../settings";
import type z from "zod";

export interface ProfessionalDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  specialization: string;
  services: string[];
  experience: number;
  startPrice: number;
  endPrice: number;
  bio: string;
  isVerified: boolean;
}

export type UpdateProfessionalDto = z.infer<typeof profileAndBioFormSchema>;
