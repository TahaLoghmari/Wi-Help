import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { ReviewDto, PaginationResultDto } from "@/features/reviews";

export interface GetProfessionalReviewsRequest {
  professionalId: string;
  page?: number;
  pageSize?: number;
}

const getProfessionalReviews = (request: GetProfessionalReviewsRequest) => {
  const params = new URLSearchParams();
  params.append("subjectId", request.professionalId);
  if (request.page) params.append("page", request.page.toString());
  if (request.pageSize) params.append("pageSize", request.pageSize.toString());
  return api.get<PaginationResultDto<ReviewDto>>(
    `${API_ENDPOINTS.REVIEWS.GET_REVIEWS}?${params.toString()}`,
  );
};

export function GetProfessionalReviews(request: GetProfessionalReviewsRequest) {
  return useQuery<PaginationResultDto<ReviewDto>>({
    queryKey: [
      "reviews",
      request.professionalId,
      request.page,
      request.pageSize,
    ],
    queryFn: () => getProfessionalReviews(request),
  });
}
