import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { VerificationDocumentDto } from "@/features/professional";

const getVerificationDocuments = () => {
  return api.get<VerificationDocumentDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_VERIFICATION_DOCUMENTS,
  );
};

export function GetVerificationDocuments() {
  return useQuery<VerificationDocumentDto[]>({
    queryKey: ["verificationDocuments"],
    queryFn: getVerificationDocuments,
  });
}
