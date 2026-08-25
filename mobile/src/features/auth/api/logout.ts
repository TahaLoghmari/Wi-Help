import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { tokenStorage } from "@/lib/token-storage";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { router } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";

export function useLogout() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: async () => {
      const refreshToken = await tokenStorage.getRefreshToken();
      return api.post<void>(
        API_ENDPOINTS.AUTH.LOGOUT,
        refreshToken ? { refreshToken } : undefined,
      );
    },
    onSuccess: async () => {
      await tokenStorage.clearTokens();
      queryClient.clear();
      router.replace(ROUTE_PATHS.AUTH.LOGIN);
    },
    onError: async (error) => {
      await tokenStorage.clearTokens();
      queryClient.clear();
      router.replace(ROUTE_PATHS.AUTH.LOGIN);
      handleApiError(error);
    },
  });
}
