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
  Critical: "Critical",
} as const;

export type AppointmentUrgency =
  (typeof AppointmentUrgency)[keyof typeof AppointmentUrgency];

export interface AppointmentDto {
  id: string;
  patientId: string;
  professionalId: string;
  notes: string;
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

  // Expanded properties for UI
  patientName: string;
  patientAvatar?: string;
  patientDateOfBirth?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
