import type { Address } from "@/features/auth";
import type { VerificationStatus } from "@/features/admin/types/adminTypes";

export interface GetCurrentProfessionalDto {
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
  profilePictureUrl: string;
  verificationStatus: VerificationStatus;
}
