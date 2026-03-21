import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { VerificationStatus } from "@/features/admin";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

interface UpdateProfessionalAccountStatusParams {
  professionalId: string;
  status: VerificationStatus;
}

const updateProfessionalAccountStatus = ({
  professionalId,
  status,
}: UpdateProfessionalAccountStatusParams) => {
  return api.patch(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_ACCOUNT_STATUS(professionalId),
    { status },
  );
};

export function useUpdateProfessionalAccountStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfessionalAccountStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-professionals"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-verification-documents"],
      });
      toast.success(i18n.t("toasts.admin.professionalAccountStatusUpdated"));
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
}
