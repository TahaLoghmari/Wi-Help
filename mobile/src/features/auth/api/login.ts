import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionKeys } from "@/features/auth/session";
import {
  type LoginUserDto,
  type LoginResponseDto,
} from "@/features/auth/model/api.types";
import { type ProblemDetailsDto } from "@/shared/api/enums.types";
import { AUTH_ENDPOINTS } from "@/features/auth/api/endpoints";
import { api } from "@/shared/api/api-client";
import { session } from "@/shared/api/session";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponseDto, ProblemDetailsDto, LoginUserDto>({
    mutationFn: (credentials) =>
      api.post<LoginResponseDto>(AUTH_ENDPOINTS.LOGIN, credentials),
    onSuccess: async (tokens) => {
      await session.setTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: sessionKeys.currentUser });
    },
  });
}
