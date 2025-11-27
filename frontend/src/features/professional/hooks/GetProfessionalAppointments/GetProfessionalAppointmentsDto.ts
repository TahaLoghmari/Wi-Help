import type {
  AppointmentStatus,
  AppointmentUrgency,
  PatientDto,
} from "@/features/patient";

export interface GetProfessionalAppointmentsDto {
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
  patient: PatientDto;
}
