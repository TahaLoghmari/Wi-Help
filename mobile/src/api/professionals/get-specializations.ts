import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LookupDto } from "@/types/enums.types";

function fetchSpecializations() {
  return api.get<LookupDto[]>(API_ENDPOINTS.PROFESSIONALS.GET_SPECIALIZATIONS);
}

export function useGetSpecializations() {
  return useQuery<LookupDto[]>({
    queryKey: ["specializations"],
    queryFn: fetchSpecializations,
    staleTime: 1000 * 60 * 60,
  });
}
