import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { CountryDto } from "./CountryDto";

const getCountriesFromApi = () => {
  return api.get<CountryDto[]>(API_ENDPOINTS.AUTH.GET_COUNTRIES);
};

export function GetCountries() {
  return useQuery<CountryDto[]>({
    queryKey: ["countries"],
    queryFn: getCountriesFromApi,
    staleTime: 1000 * 60 * 60,
  });
}
