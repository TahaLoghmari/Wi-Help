export interface CreateEducationRequest {
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  country?: string | null;
  startYear: string;
  endYear?: string | null;
  isCurrentlyStudying?: boolean;
}
