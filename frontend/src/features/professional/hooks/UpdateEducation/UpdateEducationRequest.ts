export interface UpdateEducationRequest {
  institution?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  country?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  isCurrentlyStudying?: boolean | null;
}
