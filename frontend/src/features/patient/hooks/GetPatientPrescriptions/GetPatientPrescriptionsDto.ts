export interface ProfessionalInfoDto {
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  specialization?: string;
}

export interface GetPatientPrescriptionsDto {
  id: string;
  appointmentId: string;
  patientId: string;
  professionalId: string;
  pdfUrl: string;
  title?: string;
  notes?: string;
  issuedAt: string;
  createdAt: string;
  professional?: ProfessionalInfoDto;
}
