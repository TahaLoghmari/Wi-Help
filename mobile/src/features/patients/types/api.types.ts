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
