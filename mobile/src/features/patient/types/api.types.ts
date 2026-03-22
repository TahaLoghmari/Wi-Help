import { type Address } from "@/features/auth/types/api.types";

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
