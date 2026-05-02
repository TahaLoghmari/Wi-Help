import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type ProfessionalEducationDto } from "@/features/professionals/types/profile.types";

function getProfessionalEducations(professionalId: string) {
  return api.get<ProfessionalEducationDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_EDUCATIONS(professionalId),
  );
}

export function useGetProfessionalEducations(
  professionalId: string | undefined,
) {
  return useQuery<ProfessionalEducationDto[]>({
    queryKey: ["professionalEducations", professionalId],
    queryFn: () => getProfessionalEducations(professionalId!),
    enabled: Boolean(professionalId),
  });
}
