export interface ProblemDetailsDto {
  detail?: string;
  errors?: Record<string, unknown>;
  requestedId: string;
  status: number;
  title?: string;
  traceId: string;
  type?: string;
}

export interface PaginationResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
