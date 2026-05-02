import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type ProfessionalDocumentDto } from "@/features/professionals/types/profile.types";

function getProfessionalDocuments(professionalId: string) {
  return api.get<ProfessionalDocumentDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_DOCUMENTS(professionalId),
  );
}

export function useGetProfessionalDocuments(
  professionalId: string | undefined,
) {
  return useQuery<ProfessionalDocumentDto[]>({
    queryKey: ["professionalDocuments", professionalId],
    queryFn: () => getProfessionalDocuments(professionalId!),
    enabled: Boolean(professionalId),
  });
}
