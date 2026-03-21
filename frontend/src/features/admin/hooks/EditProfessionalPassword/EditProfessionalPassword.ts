import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

interface EditProfessionalPasswordParams {
  userId: string;
  newPassword: string;
}

const editProfessionalPassword = ({
  userId,
  newPassword,
}: EditProfessionalPasswordParams) => {
  return api.patch(API_ENDPOINTS.IDENTITY.ADMIN_CHANGE_PASSWORD(userId), {
    newPassword,
  });
};

export function EditProfessionalPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProfessionalPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-professionals"] });
      toast.success(i18n.t("toasts.admin.professionalPasswordUpdated"));
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
}
