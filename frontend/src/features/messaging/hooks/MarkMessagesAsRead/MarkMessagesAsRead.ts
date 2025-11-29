import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { handleApiError } from "@/hooks";

const markMessagesAsRead = (conversationId: string) => {
  return api.post<void>(
    API_ENDPOINTS.MESSAGING.MARK_MESSAGES_AS_READ(conversationId),
  );
};

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: (_, conversationId) => {
      // Invalidate messages to update read status
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

