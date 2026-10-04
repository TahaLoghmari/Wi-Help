import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { type ProfessionalExperienceDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalExperiences(professionalId: string) {
  return api.get<ProfessionalExperienceDto[]>(
    PROFESSIONAL_ENDPOINTS.GET_PROFESSIONAL_EXPERIENCES(professionalId),
  );
}

export function useGetProfessionalExperiences(
  professionalId: string | undefined,
) {
  return useQuery<ProfessionalExperienceDto[]>({
    queryKey: professionalKeys.experiencesByProfessional(professionalId),
    queryFn: () => getProfessionalExperiences(professionalId!),
    enabled: Boolean(professionalId),
  });
}
