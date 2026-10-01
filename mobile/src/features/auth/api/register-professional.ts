import { useMutation } from "@tanstack/react-query";
import { type RegisterProfessionalDto } from "@/features/auth/model/api.types";
import { type ProblemDetailsDto } from "@/shared/api/enums.types";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api";
import { api } from "@/shared/api/api-client";

export function useRegisterProfessional() {
  return useMutation<void, ProblemDetailsDto, RegisterProfessionalDto>({
    mutationFn: (credentials) =>
      api.post<void>(
        PROFESSIONAL_ENDPOINTS.REGISTER_PROFESSIONAL,
        credentials,
      ),
  });
}
