import { type Address } from "@/features/auth";
import type { profileAndBioFormSchema, scheduleFormSchema } from "@/features/professional";
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

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
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

export interface ScheduleDto {
  timeZoneId?: string; // Default value "Africa/Tunis" can be applied during object creation
  days: DayAvailabilityDto[];
}


export type UpdateProfessionalDto = z.infer<typeof profileAndBioFormSchema>;
export type SetupScheduleDto = z.infer<typeof scheduleFormSchema>;