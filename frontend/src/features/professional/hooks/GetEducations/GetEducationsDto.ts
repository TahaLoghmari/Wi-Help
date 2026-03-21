export interface GetEducationsDto {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  countryId: string;
  description: string;
  startYear: string;
  endYear?: string | null;
  isCurrentlyStudying: boolean;
  createdAt: string;
  updatedAt: string;
}
