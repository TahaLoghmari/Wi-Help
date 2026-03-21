import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

interface UpdateDocumentStatusParams {
  documentId: string;
  status: "Pending" | "Verified" | "Rejected";
}

export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, status }: UpdateDocumentStatusParams) => {
      await api.patch(
        API_ENDPOINTS.PROFESSIONALS.UPDATE_DOCUMENT_STATUS_AS_ADMIN(documentId),
        { status },
      );
    },
    onSuccess: () => {
      toast.success(i18n.t("toasts.admin.documentStatusUpdated"));
      queryClient.invalidateQueries({
        queryKey: ["admin-verification-documents"],
      });
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
};
