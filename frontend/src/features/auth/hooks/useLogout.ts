import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProblemDetailsDto } from "@/types/api.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api, handleApiError } from "@/index";
import { toast } from "sonner";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export const logout = () => {
  return api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
};

export function useLogout() {
  const queryClient = useQueryClient();
  const { goToLogin } = useAppNavigation();

  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: logout,
    onSuccess: async () => {
      // Clear all cached queries
      queryClient.clear();
      
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
      });
      
      // Navigate to login page
      goToLogin();
    },
    onError: (error) => {
      handleApiError({
        apiError: error,
      });
    },
  });
}
