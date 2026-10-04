import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { type ProfessionalDocumentDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalDocuments(professionalId: string) {
  return api.get<ProfessionalDocumentDto[]>(
    PROFESSIONAL_ENDPOINTS.GET_PROFESSIONAL_DOCUMENTS(professionalId),
  );
}

export function useGetProfessionalDocuments(
  professionalId: string | undefined,
) {
  return useQuery<ProfessionalDocumentDto[]>({
    queryKey: professionalKeys.documentsByProfessional(professionalId),
    queryFn: () => getProfessionalDocuments(professionalId!),
    enabled: Boolean(professionalId),
  });
}
