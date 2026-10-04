import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { LOCATION_ENDPOINTS } from "@/shared/api/location/endpoints";
import type { StateDto } from "./types";

function fetchStatesByCountry(countryId: string) {
  return api.get<StateDto[]>(
    LOCATION_ENDPOINTS.GET_STATES_BY_COUNTRY(countryId),
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
