import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PATIENT_ENDPOINTS } from "@/features/patients/api/endpoints";
import { patientKeys } from "./keys";
import type { LookupDto } from "@/shared/api/enums.types";

const getConditions = () => {
  return api.get<LookupDto[]>(PATIENT_ENDPOINTS.GET_CONDITIONS);
};

export function useGetConditions() {
  return useQuery<LookupDto[]>({
    queryKey: patientKeys.conditions,
    queryFn: getConditions,
    staleTime: 1000 * 60 * 60,
  });
}
