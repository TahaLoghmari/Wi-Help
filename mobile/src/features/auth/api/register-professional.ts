import { useMutation } from "@tanstack/react-query";
import { type RegisterProfessionalDto } from "@/features/auth/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";

export function useRegisterProfessional() {
  return useMutation<void, ProblemDetailsDto, RegisterProfessionalDto>({
    mutationFn: (credentials) =>
      api.post<void>(
        API_ENDPOINTS.PROFESSIONALS.REGISTER_PROFESSIONAL,
        credentials,
      ),
  });
}
