import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

interface UpdateDocumentStatusParams {
  documentId: string;
  status: "Pending" | "Verified" | "Rejected";
}

export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, status }: UpdateDocumentStatusParams) => {
      await api.put(
        API_ENDPOINTS.PROFESSIONALS.UPDATE_DOCUMENT_STATUS_AS_ADMIN(documentId),
        { status },
      );
    },
    onSuccess: () => {
      toast.success("Document status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin-verification-documents"],
      });
    },
    onError: () => {
      toast.error("Failed to update document status");
    },
  });
};
