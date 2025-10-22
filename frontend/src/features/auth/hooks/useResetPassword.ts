import { useMutation } from "@tanstack/react-query";
import { type ResetPasswordDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Route as ResetPasswordRoute } from "@/routes/auth/reset-password";
import { ROUTE_PATHS } from "@/config/routes";

export const resetPassword = (credentials: ResetPasswordDto) => {
  return api.post<void>("/auth/reset-password", credentials);
};

export function useResetPassword() {
  const navigate = useNavigate({ from: ResetPasswordRoute.fullPath });
  return useMutation<void, ProblemDetailsDto, ResetPasswordDto>({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate({
        to: ROUTE_PATHS.AUTH.LOGIN,
        search: { message: undefined },
      });
      toast.success("Your password has been reset. You can now log in.");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
