import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { DeleteReviewRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";

const deleteReview = (request: DeleteReviewRequest) => {
  return api.delete<void>(
    API_ENDPOINTS.REVIEWS.DELETE_REVIEW(request.reviewId),
  );
};

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, DeleteReviewRequest>({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professional-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["professional-review-stats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-review-stats"],
      });
      toast.success("Review deleted!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
