import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";
import { type ReviewStatsDto } from "@/features/reviews/types/api.types";

function getPatientReviewStats(patientId: string) {
  return api.get<ReviewStatsDto>(
    `${API_ENDPOINTS.REVIEWS.GET_REVIEW_STATS}?subjectId=${patientId}`,
  );
}

export function useGetPatientReviewStats(patientId: string | undefined) {
  return useQuery<ReviewStatsDto>({
    queryKey: patientId
      ? reviewKeys.patientReviewStats(patientId)
      : ["review-stats-disabled"],
    queryFn: () => getPatientReviewStats(patientId!),
    enabled: !!patientId,
  });
}
