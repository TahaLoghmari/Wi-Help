import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PATIENT_MEMBERSHIP_ENDPOINTS } from "@/features/patients/api/endpoints";
import { patientKeys } from "./keys";
import { type PatientDto } from "./contracts";
import { type PaginationResultDto } from "@/shared/api/enums.types";

function getProfessionalPatients(page: number) {
  return api.get<PaginationResultDto<PatientDto>>(
    `${PATIENT_MEMBERSHIP_ENDPOINTS.GET_MY_PATIENTS}?page=${page}&pageSize=10`,
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
