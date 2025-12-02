import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { VerificationDocumentDto } from "@/features/professional";

export interface GetProfessionalDocumentsRequest {
  professionalId: string;
}

const getProfessionalDocuments = (request: GetProfessionalDocumentsRequest) => {
  return api.get<VerificationDocumentDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_DOCUMENTS(
      request.professionalId,
    ),
  );
};

export function useGetProfessionalDocuments(
  request: GetProfessionalDocumentsRequest,
) {
  return useQuery<VerificationDocumentDto[]>({
    queryKey: ["professionalDocuments", request.professionalId],
    queryFn: () => getProfessionalDocuments(request),
    enabled: !!request.professionalId,
  });
}
