import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { DeleteReplyRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

const deleteReply = (request: DeleteReplyRequest) => {
  return api.delete<void>(
    API_ENDPOINTS.REVIEWS.DELETE_REPLY(request.reviewId, request.replyId),
  );
};

export function useDeleteReply() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, DeleteReplyRequest>({
    mutationFn: deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(i18n.t("toasts.reviews.replyDeleted"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
