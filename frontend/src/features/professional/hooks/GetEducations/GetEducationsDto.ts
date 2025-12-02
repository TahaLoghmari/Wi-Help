export interface GetEducationsDto {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  country?: string | null;
  startYear: string;
  endYear?: string | null;
  isCurrentlyStudying: boolean;
  createdAt: string;
  updatedAt: string;
}
