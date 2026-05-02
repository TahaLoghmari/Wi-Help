import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";
import { type ReviewStatsDto } from "@/features/reviews/types/api.types";

function getProfessionalReviewStats(professionalId: string) {
  return api.get<ReviewStatsDto>(
    `${API_ENDPOINTS.REVIEWS.GET_REVIEW_STATS}?subjectId=${professionalId}`,
  );
}

export function useGetProfessionalReviewStats(
  professionalId: string | undefined,
) {
  return useQuery<ReviewStatsDto>({
    queryKey: professionalId
      ? reviewKeys.patientReviewStats(professionalId)
      : ["professional-review-stats-disabled"],
    queryFn: () => getProfessionalReviewStats(professionalId!),
    enabled: !!professionalId,
  });
}
