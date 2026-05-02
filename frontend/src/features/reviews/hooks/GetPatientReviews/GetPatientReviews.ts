import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { ReviewDto, PaginationResultDto } from "@/features/reviews";

export interface GetPatientReviewsRequest {
  patientId: string;
  page?: number;
  pageSize?: number;
}

const getPatientReviews = (request: GetPatientReviewsRequest) => {
  const params = new URLSearchParams();
  params.append("subjectId", request.patientId);
  if (request.page) params.append("page", request.page.toString());
  if (request.pageSize) params.append("pageSize", request.pageSize.toString());
  return api.get<PaginationResultDto<ReviewDto>>(
    `${API_ENDPOINTS.REVIEWS.GET_REVIEWS}?${params.toString()}`,
  );
};

export function GetPatientReviews(request: GetPatientReviewsRequest) {
  return useQuery<PaginationResultDto<ReviewDto>>({
    queryKey: ["reviews", request.patientId, request.page, request.pageSize],
    queryFn: () => getPatientReviews(request),
  });
}
