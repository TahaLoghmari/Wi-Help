import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type LoginUserDto,
  type LoginResponseDto,
} from "@/features/auth/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { authKeys } from "./keys";
import { api } from "@/lib/api-client";
import { tokenStorage } from "@/lib/token-storage";
import { useHandleApiError } from "@/hooks/use-handle-api-error";

export function useLogin() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<LoginResponseDto, ProblemDetailsDto, LoginUserDto>({
    mutationFn: (credentials) =>
      api.post<LoginResponseDto>(API_ENDPOINTS.AUTH.LOGIN, credentials),
    onSuccess: async (tokens) => {
      await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    },
    onError: (error) => handleApiError(error),
  });
}
