import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { ReviewStatsDto } from "@/features/reviews";

const getPatientReviewStats = (patientId: string) => {
  return api.get<ReviewStatsDto>(
    `${API_ENDPOINTS.REVIEWS.GET_REVIEW_STATS}?subjectId=${patientId}`,
  );
};

export function GetPatientReviewStats(patientId: string) {
  return useQuery<ReviewStatsDto>({
    queryKey: ["review-stats", patientId],
    queryFn: () => getPatientReviewStats(patientId),
    enabled: !!patientId,
  });
}
