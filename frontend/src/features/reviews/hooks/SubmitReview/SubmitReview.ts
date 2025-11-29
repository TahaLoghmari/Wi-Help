import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { SubmitReviewRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";

const submitReview = (request: SubmitReviewRequest) => {
  return api.post<void>(API_ENDPOINTS.REVIEWS.SUBMIT_REVIEW, request);
};

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, SubmitReviewRequest>({
    mutationFn: submitReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["professional-reviews", variables.professionalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["professional-review-stats", variables.professionalId],
      });
      toast.success("Review submitted successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}

