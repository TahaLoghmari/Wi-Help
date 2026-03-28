export interface ServiceDto {
  id: string;
  key: string;
}

export interface SpecializationDto {
  id: string;
  key: string;
}

export interface ProfessionalSelfDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}
