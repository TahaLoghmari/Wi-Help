export interface UpdateEducationRequest {
  institution?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  countryId?: string | null;
  description?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  isCurrentlyStudying?: boolean | null;
}
