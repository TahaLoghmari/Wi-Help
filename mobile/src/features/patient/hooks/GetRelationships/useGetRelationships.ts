import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LookupDto } from "../LookupDto";

const getRelationships = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_RELATIONSHIPS);
};

export function useGetRelationships() {
  return useQuery<LookupDto[]>({
    queryKey: ["relationships"],
    queryFn: getRelationships,
    staleTime: 1000 * 60 * 60,
  });
}
