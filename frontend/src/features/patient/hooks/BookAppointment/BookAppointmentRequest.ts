export interface BookAppointmentRequest {
  professionalId: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  price: number;
  notes: string;
}
