import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { ReviewStatsDto } from "@/features/reviews";

const getProfessionalReviewStats = (professionalId: string) => {
  return api.get<ReviewStatsDto>(
    `${API_ENDPOINTS.REVIEWS.GET_REVIEW_STATS}?subjectId=${professionalId}`,
  );
};

export function GetProfessionalReviewStats(professionalId: string) {
  return useQuery<ReviewStatsDto>({
    queryKey: ["review-stats", professionalId],
    queryFn: () => getProfessionalReviewStats(professionalId),
  });
}
