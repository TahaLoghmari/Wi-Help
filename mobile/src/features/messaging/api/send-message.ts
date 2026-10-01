import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MESSAGING_ENDPOINTS } from "@/features/messaging/api/endpoints";
import { api } from "@/shared/api/api-client";
import type { ProblemDetailsDto } from "@/shared/api/enums.types";
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
        MESSAGING_ENDPOINTS.SEND_MESSAGE(conversationId),
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
