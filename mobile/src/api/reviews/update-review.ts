import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";
import { type UpdateReviewRequest } from "@/features/reviews/types/api.types";

function updateReview({
  reviewId,
  data,
}: {
  reviewId: string;
  data: UpdateReviewRequest;
}) {
  return api.put(API_ENDPOINTS.REVIEWS.UPDATE_REVIEW(reviewId), data);
}

export function useUpdateReview(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReview,
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
