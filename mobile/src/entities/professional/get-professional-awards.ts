import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type ProfessionalAwardDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalAwards(professionalId: string) {
  return api.get<ProfessionalAwardDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_AWARDS(professionalId),
  );
}

export function useGetProfessionalAwards(professionalId: string | undefined) {
  return useQuery<ProfessionalAwardDto[]>({
    queryKey: professionalKeys.awardsByProfessional(professionalId),
    queryFn: () => getProfessionalAwards(professionalId!),
    enabled: Boolean(professionalId),
  });
}
