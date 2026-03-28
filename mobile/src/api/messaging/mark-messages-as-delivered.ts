import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { messagingKeys } from "./keys";

function markMessagesAsDelivered(conversationId: string) {
  return api.post<void>(
    API_ENDPOINTS.MESSAGING.MARK_MESSAGES_AS_DELIVERED(conversationId),
  );
}

export function useMarkMessagesAsDelivered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesAsDelivered,
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: messagingKeys.messages(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations,
      });
    },
  });
}
