import { type Address } from "@/types/enums.types";

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

export interface PatientSummaryDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  profilePictureUrl?: string;
}

export interface AppointmentDto {
  id: string;
  patientId: string;
  professionalId: string;
  notes?: string;
  startDate: string;
  endDate: string;
  urgency: AppointmentUrgency;
  status: AppointmentStatus;
  price: number;
  offeredAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  patient: PatientSummaryDto;
}

export interface RespondToAppointmentDto {
  appointmentId: string;
  isAccepted: boolean;
}

export interface CompleteAppointmentRequest {
  appointmentId: string;
  prescriptionPdf: { uri: string; name: string; type: string };
  prescriptionTitle?: string;
  prescriptionNotes?: string;
}
