import type { AppointmentUrgency } from "@/features/professional";

export interface BookAppointmentRequest {
  professionalId: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  price: number;
  urgency: AppointmentUrgency;
  notes: string;
}
