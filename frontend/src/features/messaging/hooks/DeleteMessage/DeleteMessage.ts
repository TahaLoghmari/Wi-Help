import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { handleApiError } from "@/hooks";
import { toast } from "sonner";

interface DeleteMessageParams {
  messageId: string;
  conversationId: string;
}

const deleteMessage = ({ messageId }: DeleteMessageParams) => {
  return api.delete<void>(API_ENDPOINTS.MESSAGING.DELETE_MESSAGE(messageId));
};

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, variables) => {
      // Invalidate messages for the specific conversation
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      // Invalidate conversations to update last message
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      toast.success("Message deleted");
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
      toast.error("Failed to delete message");
    },
  });
}
