import { useMutation } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import i18n from "i18next";

export const sendConfirmationEmail = (email: string) => {
  return api.post<void>(API_ENDPOINTS.AUTH.SEND_CONFIRMATION_EMAIL, email);
};

export function useSendConfirmationEmail() {
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: sendConfirmationEmail,
    onSuccess: () => {
      toast.success(i18n.t("toasts.auth.confirmationEmailSent"), {
        description: i18n.t("toasts.auth.confirmationEmailSentDescription"),
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
