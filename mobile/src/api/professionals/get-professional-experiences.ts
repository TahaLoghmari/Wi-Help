import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type ProfessionalExperienceDto } from "@/features/professionals/types/profile.types";

function getProfessionalExperiences(professionalId: string) {
  return api.get<ProfessionalExperienceDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_EXPERIENCES(professionalId),
  );
}

export function useGetProfessionalExperiences(
  professionalId: string | undefined,
) {
  return useQuery<ProfessionalExperienceDto[]>({
    queryKey: ["professionalExperiences", professionalId],
    queryFn: () => getProfessionalExperiences(professionalId!),
    enabled: Boolean(professionalId),
  });
}
