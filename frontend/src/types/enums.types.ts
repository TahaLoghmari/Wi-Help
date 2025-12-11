export interface ProblemDetailsDto {
  title?: string;
  detail?: string;
  type?: string;
  status?: number;
  errors?: Record<string, string[]>;
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
