import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { StateDto } from "./types";

function fetchStatesByCountry(countryId: string) {
  return api.get<StateDto[]>(
    API_ENDPOINTS.AUTH.GET_STATES_BY_COUNTRY(countryId),
  );
}

export function getStatesByCountryQueryOptions(countryId: string) {
  return queryOptions({
    queryKey: ["states", countryId],
    queryFn: () => fetchStatesByCountry(countryId),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useGetStatesByCountry(countryId: string) {
  return useQuery(getStatesByCountryQueryOptions(countryId));
}
