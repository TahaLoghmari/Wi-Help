import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import type { GetPatientReviewStatsDto } from "@/features/reviews";

const getPatientReviewStats = (patientId: string) => {
  return api.get<GetPatientReviewStatsDto>(
    `/reviews/patient/${patientId}/stats`,
  );
};

export function GetPatientReviewStats(patientId: string) {
  return useQuery<GetPatientReviewStatsDto>({
    queryKey: ["patient-review-stats", patientId],
    queryFn: () => getPatientReviewStats(patientId),
    enabled: !!patientId,
  });
}
