import { useMutation } from "@tanstack/react-query";
import { type RegisterPatientDto } from "@/features/auth/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";

export function useRegisterPatient() {
  return useMutation<void, ProblemDetailsDto, RegisterPatientDto>({
    mutationFn: (credentials) =>
      api.post<void>(API_ENDPOINTS.PATIENTS.REGISTER_PATIENT, credentials),
  });
}
