export interface CreateEducationRequest {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  countryId: string;
  description: string;
  startYear: string;
  endYear?: string | null;
  isCurrentlyStudying?: boolean;
}
