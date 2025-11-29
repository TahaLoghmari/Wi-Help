import { type Address } from "@/features/auth";
import type {
  profileAndBioFormSchema,
  scheduleFormSchema,
} from "@/features/professional";
import type z from "zod";

export interface ProfessionalDto {
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
}

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type DayOfWeek = (typeof DAYS)[number];

export interface DayAvailabilityDto {
  dayOfWeek: DayOfWeek;
  isActive: boolean;
  availabilitySlots: AvailabilitySlotDto[];
}

export interface AvailabilitySlotDto {
  id?: string | null;
  startTime: string;
  endTime: string;
}

export type UpdateProfessionalDto = z.infer<typeof profileAndBioFormSchema>;
export type SetupScheduleDto = z.infer<typeof scheduleFormSchema>;

export interface ProfessionalsQueryParametersDto {
  search?: string;
  location?: string;
  maxPrice?: number;
  availability?: string;
}

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
