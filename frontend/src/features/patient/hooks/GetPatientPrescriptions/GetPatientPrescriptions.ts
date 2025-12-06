import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { PaginationResultDto } from "@/types";
import type {
  GetPatientPrescriptionsDto,
  GetPatientPrescriptionsRequest,
} from "@/features/patient";
import { toQueryString } from "@/lib/utils";

const getPatientPrescriptions = (request: GetPatientPrescriptionsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetPatientPrescriptionsDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PATIENT_PRESCRIPTIONS}?${queryString}`,
  );
};

export function GetPatientPrescriptions() {
  return useInfiniteQuery<PaginationResultDto<GetPatientPrescriptionsDto>>({
    queryKey: ["patient-prescriptions"],
    queryFn: ({ pageParam = 1 }) =>
      getPatientPrescriptions({ page: pageParam as number, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
