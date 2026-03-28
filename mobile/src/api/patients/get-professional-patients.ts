import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { patientKeys } from "./keys";
import { type PatientDto } from "@/features/patients/types/api.types";
import { type PaginationResultDto } from "@/types/enums.types";

function getProfessionalPatients(page: number) {
  return api.get<PaginationResultDto<PatientDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_MY_PATIENTS}?page=${page}&pageSize=10`,
  );
}

export function useGetProfessionalPatients() {
  return useInfiniteQuery<PaginationResultDto<PatientDto>>({
    queryKey: patientKeys.professionalPatients,
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalPatients(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });
}
