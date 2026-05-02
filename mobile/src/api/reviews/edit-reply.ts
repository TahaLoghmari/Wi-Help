import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";

interface EditReplyVariables {
  reviewId: string;
  replyId: string;
  patientId: string;
  data: { comment: string };
}

function editReply({ reviewId, replyId, data }: EditReplyVariables) {
  return api.put(API_ENDPOINTS.REVIEWS.EDIT_REPLY(reviewId, replyId), data);
}

export function useEditReply(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: EditReplyVariables) => editReply(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviews(patientId),
      });
    },
  });
}
