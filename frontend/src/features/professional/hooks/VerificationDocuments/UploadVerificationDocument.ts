import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { UploadVerificationDocumentRequest } from "@/features/professional";

const uploadVerificationDocument = (
  request: UploadVerificationDocumentRequest,
) => {
  const formData = new FormData();
  formData.append("documentType", request.documentType);
  formData.append("document", request.document);

  return api.post<void>(
    API_ENDPOINTS.PROFESSIONALS.UPLOAD_VERIFICATION_DOCUMENT,
    formData,
  );
};

export function UploadVerificationDocument() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ProblemDetailsDto,
    UploadVerificationDocumentRequest
  >({
    mutationFn: uploadVerificationDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verificationDocuments"] });
      toast.success("Document uploaded successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
