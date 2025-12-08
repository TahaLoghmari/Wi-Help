import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toQueryString } from "@/lib";
import type {
  GetAllAppointmentsDto,
  PaginationResultDto,
} from "@/features/admin";

export interface GetAllAppointmentsRequest {
  page: number;
  pageSize: number;
}

const getAllAppointments = (request: GetAllAppointmentsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetAllAppointmentsDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_ALL_AS_ADMIN}?${queryString}`,
  );
};

export function GetAllAppointments() {
  return useInfiniteQuery<PaginationResultDto<GetAllAppointmentsDto>>({
    queryKey: ["admin-appointments"],
    queryFn: ({ pageParam = 1 }) =>
      getAllAppointments({
        page: pageParam as number,
        pageSize: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const hasNextPage =
        lastPage.totalCount > pages.length * lastPage.pageSize;
      return hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
