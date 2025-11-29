import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type {
  GetProfessionalReviewsRequest,
  GetProfessionalReviewsDto,
  PaginationResultDto,
} from "@/features/reviews";

const getProfessionalReviews = (request: GetProfessionalReviewsRequest) => {
  const params = new URLSearchParams();
  if (request.page) params.append("page", request.page.toString());
  if (request.pageSize) params.append("pageSize", request.pageSize.toString());

  const queryString = params.toString();
  const url = `${API_ENDPOINTS.REVIEWS.GET_PROFESSIONAL_REVIEWS(request.professionalId)}${
    queryString ? `?${queryString}` : ""
  }`;

  return api.get<PaginationResultDto<GetProfessionalReviewsDto>>(url);
};

export function GetProfessionalReviews(request: GetProfessionalReviewsRequest) {
  return useQuery<PaginationResultDto<GetProfessionalReviewsDto>>({
    queryKey: ["professional-reviews", request.professionalId, request.page, request.pageSize],
    queryFn: () => getProfessionalReviews(request),
  });
}

