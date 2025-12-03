import { useInfiniteQuery } from "@tanstack/react-query";
import { type ProfessionalDto } from "@/features/professional";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { PaginationResultDto } from "@/types";
import type { GetPatientProfessionalsRequest } from "./GetPatientProfessionalsRequest";
import { toQueryString } from "@/lib";

const getPatientProfessionals = (request: GetPatientProfessionalsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<ProfessionalDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_MY_PROFESSIONALS}?${queryString}`,
  );
};

export function GetPatientProfessionals() {
  return useInfiniteQuery<PaginationResultDto<ProfessionalDto>>({
    queryKey: ["patientProfessionals"],
    queryFn: ({ pageParam = 1 }) =>
      getPatientProfessionals({ page: pageParam as number, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
