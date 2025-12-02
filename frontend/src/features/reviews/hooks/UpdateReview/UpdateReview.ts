import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { UpdateReviewRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";

const updateReview = (request: UpdateReviewRequest) => {
  return api.put<void>(API_ENDPOINTS.REVIEWS.UPDATE_REVIEW(request.reviewId), {
    comment: request.comment,
    rating: request.rating,
  });
};

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, UpdateReviewRequest>({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professional-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["professional-review-stats"],
      });
      toast.success("Review updated successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
