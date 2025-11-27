export interface GetProfessionalsRequest {
  search?: string;
  location?: string;
  maxPrice?: number;
  availability?: string;
  page: number;
  pageSize: number;
}
