import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PATIENT_ENDPOINTS } from "@/features/patients/api/endpoints";
import type { LookupDto } from "@/shared/api/enums.types";
import { patientKeys } from "./keys";

function fetchRelationships() {
  return api.get<LookupDto[]>(PATIENT_ENDPOINTS.GET_RELATIONSHIPS);
}

export function useGetRelationships() {
  return useQuery<LookupDto[]>({
    queryKey: patientKeys.relationships,
    queryFn: fetchRelationships,
    staleTime: 1000 * 60 * 60,
  });
}
