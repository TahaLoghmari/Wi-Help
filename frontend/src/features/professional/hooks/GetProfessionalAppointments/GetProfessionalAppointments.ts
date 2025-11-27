import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toQueryString } from "@/lib";
import type { PaginationResultDto } from "@/types";
import type {
  GetProfessionalAppointmentsDto,
  GetProfessionalAppointmentsRequest,
} from "@/features/professional";

const getProfessionalAppointments = (
  request: GetProfessionalAppointmentsRequest,
) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetProfessionalAppointmentsDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PROFESSIONAL_APPOINTMENTS}?${queryString}`,
  );
};

export function GetProfessionalAppointments() {
  return useInfiniteQuery<PaginationResultDto<GetProfessionalAppointmentsDto>>({
    queryKey: ["professional-appointments"],
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalAppointments({
        page: pageParam as number,
        pageSize: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
