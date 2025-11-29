import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { handleApiError } from "@/hooks";

const markMessagesAsDelivered = (conversationId: string) => {
  return api.post<void>(
    API_ENDPOINTS.MESSAGING.MARK_MESSAGES_AS_DELIVERED(conversationId),
  );
};

export function useMarkMessagesAsDelivered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesAsDelivered,
    onSuccess: (_, conversationId) => {
      // Invalidate messages to update delivery status
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
      // Invalidate conversations to update UI
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
}
