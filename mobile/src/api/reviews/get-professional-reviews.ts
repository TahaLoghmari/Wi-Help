import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";
import { type ReviewDto } from "@/features/reviews/types/api.types";
import { type PaginationResultDto } from "@/types/enums.types";

function getProfessionalReviews(professionalId: string, page: number) {
  return api.get<PaginationResultDto<ReviewDto>>(
    `${API_ENDPOINTS.REVIEWS.GET_REVIEWS}?subjectId=${professionalId}&page=${page}&pageSize=10`,
  );
}

export function useGetProfessionalReviews(professionalId: string | undefined) {
  return useInfiniteQuery<PaginationResultDto<ReviewDto>>({
    queryKey: professionalId
      ? reviewKeys.patientReviews(professionalId)
      : ["professional-reviews-disabled"],
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalReviews(professionalId!, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
    enabled: !!professionalId,
  });
}
