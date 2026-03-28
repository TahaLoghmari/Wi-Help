import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { StateDto } from "@/types/enums.types";

function fetchStatesByCountry(countryId: string) {
  return api.get<StateDto[]>(
    API_ENDPOINTS.AUTH.GET_STATES_BY_COUNTRY(countryId),
  );
}

export function useGetStatesByCountry(countryId: string) {
  return useQuery<StateDto[]>({
    queryKey: ["states", countryId],
    queryFn: () => fetchStatesByCountry(countryId),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 60,
  });
}
