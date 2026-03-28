import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { type SendMessageRequest } from "@/features/messaging/types/messaging.types";
import { messagingKeys } from "./keys";

interface SendMessageParams {
  conversationId: string;
  request: SendMessageRequest;
}

function sendMessage({ conversationId, request }: SendMessageParams) {
  return api.post<{ messageId: string }>(
    API_ENDPOINTS.MESSAGING.SEND_MESSAGE(conversationId),
    request,
  );
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<
    { messageId: string },
    ProblemDetailsDto,
    SendMessageParams
  >({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: messagingKeys.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations,
      });
    },
    onError: handleApiError,
  });
}
