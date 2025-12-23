import type { Address } from "@/features/auth";

export interface GetProfessionalsDto {
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
  services?: string[];
  experience: number;
  visitPrice: number;
  bio?: string;
  isVerified: boolean;
  profilePictureUrl?: string;
  distanceKm?: number;
}
