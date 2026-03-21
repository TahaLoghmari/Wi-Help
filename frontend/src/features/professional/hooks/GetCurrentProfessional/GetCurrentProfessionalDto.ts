import type { Address } from "@/features/auth";
import type { VerificationStatus } from "@/features/admin/types/adminTypes";
import type { ServiceDto } from "@/features/professional/hooks/GetServicesBySpecialization";
import type { SpecializationDto } from "@/features/professional/hooks/GetSpecializations";

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
  specialization: SpecializationDto;
  services: ServiceDto[];
  experience: number;
  visitPrice: number;
  bio: string;
  profilePictureUrl: string;
  verificationStatus: VerificationStatus;
}
