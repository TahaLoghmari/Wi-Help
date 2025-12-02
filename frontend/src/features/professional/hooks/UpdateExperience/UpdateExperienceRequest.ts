export interface UpdateExperienceRequest {
  title?: string | null;
  organization?: string | null;
  location?: string | null;
  description?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  isCurrentPosition?: boolean | null;
}
