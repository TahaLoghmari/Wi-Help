/**
 * Shared type definitions.
 *
 * Mirrors: /frontend/src/types/enums.types.ts
 *
 * These DTOs are shared between frontend and mobile since they both
 * communicate with the same backend API.
 */

export interface ProblemDetailsDto {
  title?: string;
  detail?: string;
  type?: string;
  status?: number;
  errors?: Array<{ code: string; description: string; type: number }>;
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
