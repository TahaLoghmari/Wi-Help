import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";

interface DeleteReplyVariables {
  reviewId: string;
  replyId: string;
}

function deleteReply({ reviewId, replyId }: DeleteReplyVariables) {
  return api.delete(API_ENDPOINTS.REVIEWS.DELETE_REPLY(reviewId, replyId));
}

export function useDeleteReply(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: DeleteReplyVariables) => deleteReply(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviews(patientId),
      });
    },
  });
}
