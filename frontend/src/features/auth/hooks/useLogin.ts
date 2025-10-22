import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type LoginUserDto } from "@/features/auth";
import { type ProblemDetailsDto } from "@/types/api.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api, handleApiError } from "@/index";
import { toast } from "sonner";
import { useAppNavigation } from "@/hooks";

export const login = (credentials: LoginUserDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.LOGIN, credentials);
};

export function useLogin() {
  const { goToHome } = useAppNavigation();
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, LoginUserDto>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      goToHome();
    },
    onError: (error, credentials) => {
      // this is for the toast error when email is not verified
      handleApiError({
        apiError: error,
        email: credentials?.email,
      });
    },
  });
}
