import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type ProfessionalAwardDto } from "@/features/professionals/types/profile.types";

function getProfessionalAwards(professionalId: string) {
  return api.get<ProfessionalAwardDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_AWARDS(professionalId),
  );
}

export function useGetProfessionalAwards(professionalId: string | undefined) {
  return useQuery<ProfessionalAwardDto[]>({
    queryKey: ["professionalAwards", professionalId],
    queryFn: () => getProfessionalAwards(professionalId!),
    enabled: Boolean(professionalId),
  });
}
