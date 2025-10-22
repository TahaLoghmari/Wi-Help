import { useMutation } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";

export const sendConfirmationEmail = (email: string) => {
  return api.post<void>(API_ENDPOINTS.AUTH.SEND_CONFIRMATION_EMAIL, email);
};

export function useSendConfirmationEmail() {
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: sendConfirmationEmail,
    onSuccess: () => {
      toast.success("Confirmation email sent!", {
        description: "Please check your inbox and verify your email address.",
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
