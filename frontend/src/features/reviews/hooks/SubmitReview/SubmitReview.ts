import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { SubmitReviewRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

const submitReview = (request: SubmitReviewRequest) => {
  return api.post<void>(API_ENDPOINTS.REVIEWS.SUBMIT_REVIEW, request);
};

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, SubmitReviewRequest>({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-stats"] });
      toast.success(i18n.t("reviews.submitSuccess"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
