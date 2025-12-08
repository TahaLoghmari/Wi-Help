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
  verificationStatus: VerificationStatus;
}

const updateProfessionalAccountStatus = ({
  professionalId,
  verificationStatus,
}: UpdateProfessionalAccountStatusParams) => {
  const request: UpdateProfessionalAccountStatusRequest = {
    verificationStatus,
  };
  return api.patch(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_ACCOUNT_STATUS(professionalId),
    request,
  );
};

export function UpdateProfessionalAccountStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfessionalAccountStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-professionals"] });
      toast.success("Professional account status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update professional account status");
    },
  });
}
