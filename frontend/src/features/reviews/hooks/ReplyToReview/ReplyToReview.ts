import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { ReplyToReviewRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";

const replyToReview = (request: ReplyToReviewRequest) => {
  return api.post<void>(
    API_ENDPOINTS.REVIEWS.REPLY_TO_REVIEW(request.reviewId),
    {
      comment: request.comment,
    },
  );
};

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, ReplyToReviewRequest>({
    mutationFn: replyToReview,
    onSuccess: () => {
      // Invalidate all professional reviews queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["professional-reviews"],
      });
      // Invalidate review stats to update reply counts
      queryClient.invalidateQueries({
        queryKey: ["professional-review-stats"],
      });
      // Invalidate patient reviews queries
      queryClient.invalidateQueries({
        queryKey: ["patient-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-review-stats"],
      });
      toast.success("Reply added!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
