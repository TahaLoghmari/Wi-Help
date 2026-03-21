export interface GetExperiencesDto {
  id: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  startYear: string;
  endYear?: string | null;
  isCurrentPosition: boolean;
  createdAt: string;
  updatedAt: string;
}
