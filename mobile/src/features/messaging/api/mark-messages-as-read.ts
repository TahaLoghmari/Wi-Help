import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { MESSAGING_ENDPOINTS } from "@/features/messaging/api/endpoints";
import { messagingKeys } from "./keys";

function markMessagesAsRead(conversationId: string) {
  return api.post<void>(
    MESSAGING_ENDPOINTS.MARK_MESSAGES_AS_READ(conversationId),
  );
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesAsRead,
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
