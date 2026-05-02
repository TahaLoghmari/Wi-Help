import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { ReplyToReviewRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

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
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(i18n.t("toasts.reviews.replyAdded"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
