import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type ProfessionalDocumentDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalDocuments(professionalId: string) {
  return api.get<ProfessionalDocumentDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_DOCUMENTS(professionalId),
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
