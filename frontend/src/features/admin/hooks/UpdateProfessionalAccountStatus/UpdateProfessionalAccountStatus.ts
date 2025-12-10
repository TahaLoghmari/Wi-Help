import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type {
  UpdateProfessionalAccountStatusRequest,
  VerificationStatus,
} from "@/features/admin";
import { toast } from "sonner";

interface UpdateProfessionalAccountStatusParams {
  professionalId: string;
  status: VerificationStatus;
}

const updateProfessionalAccountStatus = ({
  professionalId,
  status,
}: UpdateProfessionalAccountStatusParams) => {
  const request: UpdateProfessionalAccountStatusRequest = {
    status,
  };
  return api.put(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_ACCOUNT_STATUS(professionalId),
    request,
  );
};

export function useUpdateProfessionalAccountStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfessionalAccountStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-professionals"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-verification-documents"],
      });
      toast.success("Professional account status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update professional account status");
    },
  });
}
