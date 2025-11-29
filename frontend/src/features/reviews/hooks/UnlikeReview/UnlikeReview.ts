import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { UnlikeReviewRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";

const unlikeReview = (request: UnlikeReviewRequest) => {
  return api.delete<void>(API_ENDPOINTS.REVIEWS.UNLIKE_REVIEW(request.reviewId));
};

export function useUnlikeReview() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, UnlikeReviewRequest>({
    mutationFn: unlikeReview,
    onSuccess: (_, variables) => {
      // Invalidate all professional reviews queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["professional-reviews"],
      });
      // Invalidate review stats to update like counts
      queryClient.invalidateQueries({
        queryKey: ["professional-review-stats"],
      });
      toast.success("Review unliked!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}

