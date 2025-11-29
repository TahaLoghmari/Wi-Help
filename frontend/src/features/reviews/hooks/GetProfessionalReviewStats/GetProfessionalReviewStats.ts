import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetProfessionalReviewStatsDto } from "@/features/reviews";

const getProfessionalReviewStats = (professionalId: string) => {
  return api.get<GetProfessionalReviewStatsDto>(
    API_ENDPOINTS.REVIEWS.GET_PROFESSIONAL_REVIEW_STATS(professionalId),
  );
};

export function GetProfessionalReviewStats(professionalId: string) {
  return useQuery<GetProfessionalReviewStatsDto>({
    queryKey: ["professional-review-stats", professionalId],
    queryFn: () => getProfessionalReviewStats(professionalId),
  });
}

