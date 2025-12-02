export interface GetExperiencesDto {
  id: string;
  title: string;
  organization: string;
  location?: string | null;
  description?: string | null;
  startYear: string;
  endYear?: string | null;
  isCurrentPosition: boolean;
  createdAt: string;
  updatedAt: string;
}
