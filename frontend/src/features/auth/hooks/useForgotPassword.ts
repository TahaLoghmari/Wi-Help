import { useMutation } from "@tanstack/react-query";
import { type ForgotPasswordDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { useNavigate } from "@tanstack/react-router";
import { Route as ForgotPasswordRoute } from "@/routes/auth/forgot-password";
import { ROUTE_PATHS } from "@/config/routes";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";

export const forgotPassword = (credentials: ForgotPasswordDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, credentials);
};

export function useForgotPassword() {
  const navigate = useNavigate({ from: ForgotPasswordRoute.fullPath });
  return useMutation<void, ProblemDetailsDto, ForgotPasswordDto>({
    mutationFn: forgotPassword,
    onSuccess: (_data, credentials) => {
      toast.success("Reset link sent!", {
        description: "Please check your email for the password reset link.",
      });
      navigate({
        to: ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
        search: { email: credentials.email },
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
