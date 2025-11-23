import { type Address, type EmergencyContact } from "@/features/auth";
import type { profileAndBioFormSchema } from "@/features/patient";
import type z from "zod";

export type MobilityStatus = "Normal" | "Limited" | "Immobile";

export interface MedicalInfo {
  chronicConditions: string[];
  allergies: string[];
  medications: string[];
  mobilityStatus: MobilityStatus;
}

export interface PatientDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address?: Address;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  bio: string;
  profilePictureUrl: string;
}

export type UpdatePatientDto = z.infer<typeof profileAndBioFormSchema>;

// Professional Availability API Types
export interface TimeSlotResponse {
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
}

export interface DailySummary {
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  availabilityPercentage: number;
}

export interface DailyAvailabilityResponse {
  date: string;
  isAvailable: boolean;
  timeSlots: TimeSlotResponse[];
  summary: DailySummary;
}

export interface MonthlyAvailabilityResponse {
  year: number;
  month: number;
  days: DailyAvailabilityResponse[];
}
