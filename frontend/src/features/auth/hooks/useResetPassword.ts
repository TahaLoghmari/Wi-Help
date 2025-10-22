import { useMutation } from "@tanstack/react-query";
import { type ResetPasswordDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useAppNavigation } from "@/hooks";

export const resetPassword = (credentials: ResetPasswordDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, credentials);
};

export function useResetPassword() {
  const { goToLogin } = useAppNavigation();
  return useMutation<void, ProblemDetailsDto, ResetPasswordDto>({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Your password has been reset. You can now log in.");
      goToLogin();
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
