import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";

function likeReview(reviewId: string) {
  return api.post(API_ENDPOINTS.REVIEWS.LIKE_REVIEW(reviewId), {});
}

function unlikeReview(reviewId: string) {
  return api.delete(API_ENDPOINTS.REVIEWS.UNLIKE_REVIEW(reviewId));
}

export function useToggleReviewLike(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      isLiked,
    }: {
      reviewId: string;
      isLiked: boolean;
    }) => (isLiked ? unlikeReview(reviewId) : likeReview(reviewId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviews(patientId),
      });
    },
  });
}
