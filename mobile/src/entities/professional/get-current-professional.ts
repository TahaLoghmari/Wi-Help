import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { professionalKeys } from "./keys";
import { type ProfessionalSelfDto } from "./contracts";

function getCurrentProfessional() {
  return api.get<ProfessionalSelfDto>(
    API_ENDPOINTS.PROFESSIONALS.CURRENT_PROFESSIONAL,
  );
}

export function useGetCurrentProfessional(
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery<ProfessionalSelfDto>({
    queryKey: professionalKeys.currentProfessional,
    queryFn: getCurrentProfessional,
    enabled,
    retry: false,
  });
}
