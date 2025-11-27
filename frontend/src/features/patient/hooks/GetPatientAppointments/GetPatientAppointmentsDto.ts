import type {
  AppointmentStatus,
  AppointmentUrgency,
  ProfessionalDto,
} from "@/features/professional";

export interface GetPatientAppointmentsDto {
  id: string;
  patientId: string;
  professionalId: string;
  notes?: string;
  startDate: string;
  endDate: string;
  urgency: AppointmentUrgency;
  status: AppointmentStatus;
  price: number;
  offeredAt: string;
  confirmedAt: string;
  completedAt: string;
  cancelledAt: string;
  createdAt: string;
  updatedAt: string;
  professional: ProfessionalDto;
}
