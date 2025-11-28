import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api, handleApiError, useAppNavigation } from "@/index";
import { toast } from "sonner";

export const logout = () => {
  return api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
};

export function useLogout() {
  const queryClient = useQueryClient();
  const { goToLogin } = useAppNavigation();

  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.clear();
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
      });
      goToLogin();
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
