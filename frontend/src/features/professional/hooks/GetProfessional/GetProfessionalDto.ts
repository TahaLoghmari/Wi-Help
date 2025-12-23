import type { Address } from "@/features/auth";
import type { VerificationStatus } from "@/features/admin/types/adminTypes";

export interface GetProfessionalDto {
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
  visitPrice: number;
  bio: string;
  isVerified: boolean;
  profilePictureUrl: string;
  verificationStatus: VerificationStatus;
  distanceKm?: number | null;
}
