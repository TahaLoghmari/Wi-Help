import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { LookupDto } from "../LookupDto";

const getRelationshipsFromApi = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_RELATIONSHIPS);
};

export function GetRelationships() {
  return useQuery<LookupDto[]>({
    queryKey: ["relationships"],
    queryFn: getRelationshipsFromApi,
    staleTime: 1000 * 60 * 60,
  });
}
