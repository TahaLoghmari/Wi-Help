import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { CountryDto } from "@/types/enums.types";

function fetchCountries() {
  return api.get<CountryDto[]>(API_ENDPOINTS.AUTH.GET_COUNTRIES);
}

export function useGetCountries() {
  return useQuery<CountryDto[]>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60,
  });
}
