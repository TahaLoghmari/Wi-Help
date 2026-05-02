import type { Address } from "@/types/enums.types";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type VerificationStatus = "Pending" | "Verified" | "Rejected";
export type DocumentStatus = "Pending" | "Verified" | "Rejected";
export type DocumentType =
  | "Diploma"
  | "ProfessionalLicense"
  | "Id"
  | "Insurance";

// ─── Core DTOs ────────────────────────────────────────────────────────────────

export interface ServiceDto {
  id: string;
  key: string;
}

export interface SpecializationDto {
  id: string;
  key: string;
}

export interface FullProfessionalDto {
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
  bio?: string | null;
  profilePictureUrl?: string | null;
  verificationStatus: VerificationStatus;
}

export interface ProfessionalEducationDto {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  countryId: string;
  description?: string | null;
  startYear: string;
  endYear?: string | null;
  isCurrentlyStudying: boolean;
}

export interface ProfessionalExperienceDto {
  id: string;
  title: string;
  organization: string;
  location: string;
  description?: string | null;
  startYear: string;
  endYear?: string | null;
  isCurrentPosition: boolean;
}

export interface ProfessionalAwardDto {
  id: string;
  title: string;
  issuer?: string | null;
  description?: string | null;
  yearReceived: string;
}

export interface ProfessionalDocumentDto {
  id: string;
  type: DocumentType;
  documentUrl: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewedAt?: string | null;
}
