import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type PaginationResultDto } from "@/types/enums.types";

import { type AppointmentDto } from "./contracts";
import { appointmentKeys } from "./keys";

function getProfessionalAppointments(page: number) {
  return api.get<PaginationResultDto<AppointmentDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PROFESSIONAL_APPOINTMENTS}?page=${page}&pageSize=20`,
  );
}

export function useGetProfessionalAppointments() {
  return useInfiniteQuery<PaginationResultDto<AppointmentDto>>({
    queryKey: appointmentKeys.professionalList(),
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalAppointments(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });
}
