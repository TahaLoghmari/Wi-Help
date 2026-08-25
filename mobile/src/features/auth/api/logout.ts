import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { session } from "@/lib/session";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: async () => {
      const refreshToken = await session.getRefreshToken();
      return api.post<void>(
        API_ENDPOINTS.AUTH.LOGOUT,
        refreshToken ? { refreshToken } : undefined,
      );
    },
    onSettled: async () => {
      await session.clear();
      queryClient.clear();
    },
  });
}
