import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { SendMessageRequest } from "@/features/messaging";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";

interface SendMessageParams {
  conversationId: string;
  request: SendMessageRequest;
}

const sendMessage = ({ conversationId, request }: SendMessageParams) => {
  return api.post<{ messageId: string }>(
    API_ENDPOINTS.MESSAGING.SEND_MESSAGE(conversationId),
    request,
  );
};

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
      toast.error("Failed to send message");
    },
  });
}
