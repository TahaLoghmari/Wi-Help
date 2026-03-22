import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type LoginUserDto } from "@/features/auth/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";
import { tokenStorage } from "@/lib/tokenStorage";
import { useHandleApiError } from "@/hooks/useHandleApiError";

interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<LoginResponseDto, ProblemDetailsDto, LoginUserDto>({
    mutationFn: (credentials) =>
      api.post<LoginResponseDto>(API_ENDPOINTS.AUTH.LOGIN, credentials),
    onSuccess: async (tokens) => {
      await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => handleApiError(error),
  });
}
