import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionKeys } from "@/entities/session";
import {
  type LoginUserDto,
  type LoginResponseDto,
} from "@/features/auth/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { session } from "@/lib/session";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponseDto, ProblemDetailsDto, LoginUserDto>({
    mutationFn: (credentials) =>
      api.post<LoginResponseDto>(API_ENDPOINTS.AUTH.LOGIN, credentials),
    onSuccess: async (tokens) => {
      await session.setTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: sessionKeys.currentUser });
    },
  });
}
