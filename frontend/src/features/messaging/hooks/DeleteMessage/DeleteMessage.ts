import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { handleApiError } from "@/hooks";
import { toast } from "sonner";

const deleteMessage = (messageId: string) => {
  return api.delete<void>(API_ENDPOINTS.MESSAGING.DELETE_MESSAGE(messageId));
};

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      // Invalidate all messages and conversations queries
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
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
