import { type Address } from "@/types/enums.types";
import { type UseFormReturn } from "react-hook-form";
import {
  type PatientFormValues,
  type ProfessionalFormValues,
} from "@/features/auth/lib/auth-validation-schemas";

export {
  type UserDto,
  type LocationCoordinates,
  type CountryDto,
  type StateDto,
} from "@/types/enums.types";

export interface EmergencyContact {
  fullName: string;
  phoneNumber: string;
  relationshipId: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface RegisterProfessionalDto {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address?: Address;
  specializationId?: string;
  experience?: number;
}

export interface RegisterPatientDto {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  role: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface GoogleAuthResponseDto {
  authorizationUrl: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export type AnyFormReturn =
  | UseFormReturn<PatientFormValues>
  | UseFormReturn<ProfessionalFormValues>;
