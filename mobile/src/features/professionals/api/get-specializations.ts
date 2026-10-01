import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import type { LookupDto } from "@/shared/api/enums.types";
import { professionalKeys } from "./keys";

function fetchSpecializations() {
  return api.get<LookupDto[]>(PROFESSIONAL_ENDPOINTS.GET_SPECIALIZATIONS);
}

export function useGetSpecializations() {
  return useQuery<LookupDto[]>({
    queryKey: professionalKeys.specializations,
    queryFn: fetchSpecializations,
    staleTime: 1000 * 60 * 60,
  });
}
