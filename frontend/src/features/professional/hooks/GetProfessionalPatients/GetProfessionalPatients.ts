import { useInfiniteQuery } from "@tanstack/react-query";
import { type PatientDto } from "@/features/patient";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { PaginationResultDto } from "@/types";
import type { GetProfessionalPatientsRequest } from "@/features/professional";
import { toQueryString } from "@/lib";

const getProfessionalPatients = (request: GetProfessionalPatientsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<PatientDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_MY_PATIENTS}?${queryString}`,
  );
};

export function GetProfessionalPatients() {
  return useInfiniteQuery<PaginationResultDto<PatientDto>>({
    queryKey: ["professionalPatients"],
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalPatients({ page: pageParam as number, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
