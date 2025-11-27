import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type {
  GetProfessionalAvailabilityRequest,
  GetProfessionalAvailabilityDto,
} from "@/features/professional";
import { toQueryString } from "@/lib/utils";

const getProfessionalAvailability = (
  request: GetProfessionalAvailabilityRequest,
) => {
  const queryString = toQueryString({
    year: request.year,
    month: request.month,
  });

  return api.get<GetProfessionalAvailabilityDto>(
    `${API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_AVAILABILITY(request.professionalId)}?${queryString}`,
  );
};

export function GetProfessionalAvailability(
  request: GetProfessionalAvailabilityRequest,
) {
  return useQuery<GetProfessionalAvailabilityDto>({
    queryKey: [
      "professionalAvailability",
      request.professionalId,
      request.year,
      request.month,
    ],
    queryFn: () => getProfessionalAvailability(request),
  });
}
