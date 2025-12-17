import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import type {
  GetPatientReviewsRequest,
  GetPatientReviewsDto,
  PaginationResultDto,
} from "@/features/reviews";

const getPatientReviews = (request: GetPatientReviewsRequest) => {
  const params = new URLSearchParams();
  if (request.page) params.append("page", request.page.toString());
  if (request.pageSize) params.append("pageSize", request.pageSize.toString());

  const queryString = params.toString();
  const url = `/reviews/patient/${request.patientId}${
    queryString ? `?${queryString}` : ""
  }`;

  return api.get<PaginationResultDto<GetPatientReviewsDto>>(url);
};

export function GetPatientReviews(request: GetPatientReviewsRequest) {
  return useQuery<PaginationResultDto<GetPatientReviewsDto>>({
    queryKey: [
      "patient-reviews",
      request.patientId,
      request.page,
      request.pageSize,
    ],
    queryFn: () => getPatientReviews(request),
  });
}
