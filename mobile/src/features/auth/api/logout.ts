import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProblemDetailsDto } from "@/shared/api/enums.types";
import { AUTH_ENDPOINTS } from "@/features/auth/api/endpoints";
import { api } from "@/shared/api/api-client";
import { session } from "@/shared/api/session";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: async () => {
      const refreshToken = await session.getRefreshToken();
      return api.post<void>(
        AUTH_ENDPOINTS.LOGOUT,
        refreshToken ? { refreshToken } : undefined,
      );
    },
    onSettled: async () => {
      await session.clear();
      queryClient.clear();
    },
  });
}
