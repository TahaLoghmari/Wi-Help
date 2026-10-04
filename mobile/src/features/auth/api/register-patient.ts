import { useMutation } from "@tanstack/react-query";
import { type RegisterPatientDto } from "@/features/auth/model/api.types";
import { type ProblemDetailsDto } from "@/shared/api/enums.types";
import { PATIENT_ENDPOINTS } from "@/features/patients/api";
import { api } from "@/shared/api/api-client";

export function useRegisterPatient() {
  return useMutation<void, ProblemDetailsDto, RegisterPatientDto>({
    mutationFn: (credentials) =>
      api.post<void>(PATIENT_ENDPOINTS.REGISTER_PATIENT, credentials),
  });
}
