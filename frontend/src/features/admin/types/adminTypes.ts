import type { Address, EmergencyContact } from "@/features/auth";
import type { MedicalInfo } from "@/features/patient/types/enums.types";
import type { GetProfessionalDto } from "@/features/professional/hooks/GetProfessional/GetProfessionalDto";
import type { PatientDto } from "@/features/patient/types/common.types";

export const AppointmentStatus = {
  Offered: "Offered",
  Confirmed: "Confirmed",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const AppointmentUrgency = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const;

export type AppointmentUrgency =
  (typeof AppointmentUrgency)[keyof typeof AppointmentUrgency];

export const VerificationStatus = {
  Pending: "Pending",
  Verified: "Verified",
  Rejected: "Rejected",
} as const;

export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

export interface GetAllAppointmentsDto {
  id: string;
  patientId: string;
  professionalId: string;
  notes: string | null;
  startDate: string;
  endDate: string;
  urgency: AppointmentUrgency;
  status: AppointmentStatus;
  price: number;
  offeredAt: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  professional: GetProfessionalDto;
  patient: PatientDto;
}

export interface GetAllProfessionalsDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  email: string;
  phoneNumber: string | null;
  specialization: string;
  createdAt: string;
  totalEarned: number;
  accountStatus: VerificationStatus;
  isBanned: boolean;
}

export interface GetAllPatientsDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  email: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  bio: string | null;
  phoneNumber: string | null;
  totalPaid: number;
  isBanned: boolean;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
}

export interface UpdateProfessionalAccountStatusRequest {
  status: VerificationStatus;
}

export interface UpdateDocumentStatusRequest {
  status: string;
}

export interface BanUserRequest {
  isBan: boolean;
}

export interface EditPasswordRequest {
  newPassword: string;
}

export interface PaginationResultDto<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ReviewAdminDto {
  id: string;
  patientId: string;
  patientName: string;
  patientProfilePicture: string;
  professionalId: string;
  professionalName: string;
  professionalProfilePicture: string;
  rating: number;
  description: string;
  date: string;
}

export interface VerificationDocumentAdminDto {
  id: string;
  type: string;
  url: string;
  status: string;
}

export interface ProfessionalVerificationDto {
  professionalId: string;
  name: string;
  profilePicture: string;
  accountStatus: string;
  documents: VerificationDocumentAdminDto[];
}

export interface PrescriptionAdminDto {
  id: string;
  patientId: string;
  patientName: string;
  patientProfilePicture: string;
  professionalId: string;
  professionalName: string;
  professionalProfilePicture: string;
  title: string;
  date: string;
  prescriptionUrl: string | null;
}

export interface ReportAdminDto {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  reporterProfilePicture: string;
  reportedId: string;
  reportedName: string;
  reportedEmail: string;
  reportedPhone: string;
  reportedProfilePicture: string;
  title: string;
  description: string;
  date: string;
  status: string;
}

export interface UpdateReportStatusRequest {
  status: string;
}
