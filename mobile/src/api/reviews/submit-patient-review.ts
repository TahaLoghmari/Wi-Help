import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";
import { type SubmitPatientReviewRequest } from "@/features/reviews/types/api.types";

function submitPatientReview(data: SubmitPatientReviewRequest) {
  return api.post(API_ENDPOINTS.REVIEWS.SUBMIT_REVIEW, {
    subjectId: data.patientId,
    comment: data.comment,
    rating: data.rating,
  });
}

export function useSubmitPatientReview(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitPatientReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviews(patientId),
      });
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviewStats(patientId),
      });
    },
  });
}
