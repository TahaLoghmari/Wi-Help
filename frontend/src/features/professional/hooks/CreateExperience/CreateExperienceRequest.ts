export interface CreateExperienceRequest {
  title: string;
  organization: string;
  location: string;
  description: string;
  startYear: string;
  endYear?: string | null;
  isCurrentPosition?: boolean;
}
