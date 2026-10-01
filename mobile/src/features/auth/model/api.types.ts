import { type Address } from "@/shared/api/location";

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
