export interface ProblemDetailsDto {
  detail?: string;
  errors?: Record<string, unknown>;
  requestedId: string;
  status: number;
  title?: string;
  traceId: string;
  type?: string;
}
