import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { type ProfessionalEducationDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalEducations(professionalId: string) {
  return api.get<ProfessionalEducationDto[]>(
    PROFESSIONAL_ENDPOINTS.GET_PROFESSIONAL_EDUCATIONS(professionalId),
  );
}

export function useGetProfessionalEducations(
  professionalId: string | undefined,
) {
  return useQuery<ProfessionalEducationDto[]>({
    queryKey: professionalKeys.educationsByProfessional(professionalId),
    queryFn: () => getProfessionalEducations(professionalId!),
    enabled: Boolean(professionalId),
  });
}
