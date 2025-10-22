import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type LoginUserDto } from "@/features/auth";
import { type ProblemDetailsDto } from "@/types/api.types";
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { api, handleApiError } from "@/index";
import { toast } from "sonner";

export const login = (credentials: LoginUserDto) => {
  return api.post<void>("/auth/login", credentials);
};

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, LoginUserDto>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      navigate({ to: ROUTE_PATHS.ROOT });
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
