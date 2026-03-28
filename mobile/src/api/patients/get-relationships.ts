import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LookupDto } from "@/types/enums.types";

function fetchRelationships() {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_RELATIONSHIPS);
}

export function useGetRelationships() {
  return useQuery<LookupDto[]>({
    queryKey: ["relationships"],
    queryFn: fetchRelationships,
    staleTime: 1000 * 60 * 60,
  });
}
