import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type RegisterUserDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import { useAppNavigation } from "@/hooks";

export const register = (credentials: RegisterUserDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.REGISTER, credentials);
};

export function useRegister() {
  const queryClient = useQueryClient();
  const { goToEmailVerification } = useAppNavigation();
  return useMutation<void, ProblemDetailsDto, RegisterUserDto>({
    mutationFn: register,
    onSuccess: (_data, credentials) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
      });
      goToEmailVerification(credentials.email);
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
