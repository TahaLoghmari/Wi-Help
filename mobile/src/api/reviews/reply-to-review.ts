import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";
import { type ReplyToReviewRequest } from "@/features/reviews/types/api.types";

function replyToReview({
  reviewId,
  data,
}: {
  reviewId: string;
  data: ReplyToReviewRequest;
}) {
  return api.post(API_ENDPOINTS.REVIEWS.REPLY_TO_REVIEW(reviewId), data);
}

export function useReplyToReview(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: replyToReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviews(patientId),
      });
    },
  });
}
