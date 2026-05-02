import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { EditReplyRequest } from "@/features/reviews";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

const editReply = (request: EditReplyRequest) => {
  return api.put<void>(
    API_ENDPOINTS.REVIEWS.EDIT_REPLY(request.reviewId, request.replyId),
    { comment: request.comment },
  );
};

export function useEditReply() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, EditReplyRequest>({
    mutationFn: editReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(i18n.t("toasts.reviews.replyUpdated"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
