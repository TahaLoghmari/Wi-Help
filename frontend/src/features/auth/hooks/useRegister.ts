import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type RegisterUserDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { ROUTE_PATHS } from "@/config/routes";
import { useNavigate } from "@tanstack/react-router";
import { Route as RegisterRoute } from "@/routes/auth/register";
import { toast } from "sonner";

export const register = (credentials: RegisterUserDto) => {
  return api.post<void>("/auth/register", credentials);
};

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: RegisterRoute.fullPath });
  return useMutation<void, ProblemDetailsDto, RegisterUserDto>({
    mutationFn: register,
    onSuccess: (_data, credentials) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
      });
      navigate({
        to: ROUTE_PATHS.AUTH.EMAIL_VERIFICATION,
        search: { email: credentials.email },
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
