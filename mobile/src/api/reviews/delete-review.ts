import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";

function deleteReview(reviewId: string) {
  return api.delete(API_ENDPOINTS.REVIEWS.DELETE_REVIEW(reviewId));
}

export function useDeleteReview(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
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
