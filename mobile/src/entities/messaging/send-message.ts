import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import type { ProblemDetailsDto } from "@/types/enums.types";
import type { SendMessageRequest } from "./contracts";
import { messagingKeys } from "./keys";

interface SendMessageParams {
  conversationId: string;
  request: SendMessageRequest;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<
    { messageId: string },
    ProblemDetailsDto,
    SendMessageParams
  >({
    mutationFn: ({ conversationId, request }) =>
      api.post<{ messageId: string }>(
        API_ENDPOINTS.MESSAGING.SEND_MESSAGE(conversationId),
        request,
      ),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: messagingKeys.messages(variables.conversationId),
      });
      void queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations,
      });
    },
  });
}
