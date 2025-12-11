export type MobilityStatus = "Normal" | "Limited" | "Immobile";
export interface MedicalInfo {
  chronicConditions: string[] | null;
  allergies: string[] | null;
  medications: string[] | null;
  mobilityStatus: MobilityStatus | null;
}

// Re-export from professional types for consistency
export {
  AppointmentStatus,
  AppointmentUrgency,
} from "@/features/professional/types/enums.types";

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
