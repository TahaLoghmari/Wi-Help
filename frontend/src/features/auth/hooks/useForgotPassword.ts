import { useMutation } from "@tanstack/react-query";
import { type ForgotPasswordDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import { useAppNavigation } from "@/hooks";

export const forgotPassword = (credentials: ForgotPasswordDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, credentials);
};

export function useForgotPassword() {
  const { goToForgotPassword } = useAppNavigation();
  return useMutation<void, ProblemDetailsDto, ForgotPasswordDto>({
    mutationFn: forgotPassword,
    onSuccess: (_data, credentials) => {
      toast.success("Reset link sent!", {
        description: "Please check your email for the password reset link.",
      });
      goToForgotPassword(credentials.email);
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
