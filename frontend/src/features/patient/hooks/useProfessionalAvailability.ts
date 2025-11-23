import { useQuery } from "@tanstack/react-query";
import { type MonthlyAvailabilityResponse } from "../types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

interface GetProfessionalAvailabilityParams {
  professionalId: string;
  year: number;
  month: number;
  timeZoneId?: string;
}

const getProfessionalAvailability = ({
  professionalId,
  year,
  month,
  timeZoneId = "Africa/Tunis",
}: GetProfessionalAvailabilityParams) => {
  const endpoint =
    API_ENDPOINTS.PATIENTS.GET_PROFESSIONAL_AVAILABILITY(professionalId);
  const queryParams = new URLSearchParams({
    year: year.toString(),
    month: month.toString(),
    timeZoneId,
  });

  return api.get<MonthlyAvailabilityResponse>(`${endpoint}?${queryParams}`);
};

export function useProfessionalAvailability(
  professionalId?: string,
  year?: number,
  month?: number,
  options?: { enabled?: boolean },
) {
  return useQuery<MonthlyAvailabilityResponse>({
    queryKey: ["professionalAvailability", professionalId, year, month],
    queryFn: () =>
      getProfessionalAvailability({
        professionalId: professionalId!,
        year: year!,
        month: month!,
      }),
    enabled: options?.enabled ?? (!!professionalId && !!year && !!month),
  });
}
