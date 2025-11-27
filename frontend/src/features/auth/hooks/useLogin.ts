import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type LoginUserDto } from "@/features/auth";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api, handleApiError } from "@/index";
import { toast } from "sonner";

export const login = (credentials: LoginUserDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.LOGIN, credentials);
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, LoginUserDto>({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      // Navigation will be handled by GuestGuard's useEffect when user data loads by invalidating queries
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
