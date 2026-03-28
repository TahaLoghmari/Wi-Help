import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { appointmentKeys } from "./keys";
import { type AppointmentDto } from "@/features/appointments/types/api.types";
import { type PaginationResultDto } from "@/types/enums.types";

function getProfessionalAppointments(page: number) {
  return api.get<PaginationResultDto<AppointmentDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PROFESSIONAL_APPOINTMENTS}?page=${page}&pageSize=20`,
  );
}

export function useGetProfessionalAppointments() {
  return useInfiniteQuery<PaginationResultDto<AppointmentDto>>({
    queryKey: appointmentKeys.all,
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalAppointments(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });
}
