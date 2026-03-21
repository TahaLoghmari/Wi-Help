import { useMutation } from "@tanstack/react-query";
import { type ChangePasswordDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/endpoints";
import i18n from "i18next";

export const changePassword = (credentials: ChangePasswordDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, credentials);
};

export function useChangePassword() {
  return useMutation<void, ProblemDetailsDto, ChangePasswordDto>({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(i18n.t("toasts.auth.passwordChanged"), {
        description: i18n.t("toasts.auth.passwordChangedDescription"),
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
