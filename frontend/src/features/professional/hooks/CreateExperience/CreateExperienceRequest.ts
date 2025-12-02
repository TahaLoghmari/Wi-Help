export interface CreateExperienceRequest {
  title: string;
  organization: string;
  location?: string | null;
  description?: string | null;
  startYear: string;
  endYear?: string | null;
  isCurrentPosition?: boolean;
}
