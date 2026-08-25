import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LookupDto } from "@/types/enums.types";
import { professionalKeys } from "./keys";

function fetchSpecializations() {
  return api.get<LookupDto[]>(API_ENDPOINTS.PROFESSIONALS.GET_SPECIALIZATIONS);
}

export function useGetSpecializations() {
  return useQuery<LookupDto[]>({
    queryKey: professionalKeys.specializations,
    queryFn: fetchSpecializations,
    staleTime: 1000 * 60 * 60,
  });
}
