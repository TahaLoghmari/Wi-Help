import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { LOCATION_ENDPOINTS } from "@/shared/api/location/endpoints";
import type { CountryDto } from "./types";

function fetchCountries() {
  return api.get<CountryDto[]>(LOCATION_ENDPOINTS.GET_COUNTRIES);
}

export function useGetCountries() {
  return useQuery<CountryDto[]>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60,
  });
}
