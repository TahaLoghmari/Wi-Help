import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { PaginationResultDto } from "@/types";
import type {
  GetPatientAppointmentsDto,
  GetPatientAppointmentsRequest,
} from "@/features/patient";
import { toQueryString } from "@/lib/utils";

const getPatientAppointments = (request: GetPatientAppointmentsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetPatientAppointmentsDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PATIENT_APPOINTMENTS}?${queryString}`,
  );
};

export function GetPatientAppointments() {
  return useInfiniteQuery<PaginationResultDto<GetPatientAppointmentsDto>>({
    queryKey: ["patient-appointments"],
    queryFn: ({ pageParam = 1 }) =>
      getPatientAppointments({ page: pageParam as number, pageSize: 8 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
