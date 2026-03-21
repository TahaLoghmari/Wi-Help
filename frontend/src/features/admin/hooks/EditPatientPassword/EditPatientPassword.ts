import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

interface EditPatientPasswordParams {
  userId: string;
  newPassword: string;
}

const editPatientPassword = ({
  userId,
  newPassword,
}: EditPatientPasswordParams) => {
  return api.patch(API_ENDPOINTS.IDENTITY.ADMIN_CHANGE_PASSWORD(userId), {
    newPassword,
  });
};

export function EditPatientPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editPatientPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
      toast.success(i18n.t("toasts.admin.patientPasswordUpdated"));
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
}
