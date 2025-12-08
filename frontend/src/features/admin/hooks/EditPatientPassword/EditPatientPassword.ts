import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { EditPasswordRequest } from "@/features/admin";
import { toast } from "sonner";

interface EditPatientPasswordParams {
  patientId: string;
  newPassword: string;
}

const editPatientPassword = ({
  patientId,
  newPassword,
}: EditPatientPasswordParams) => {
  const request: EditPasswordRequest = { newPassword };
  return api.patch(
    API_ENDPOINTS.IDENTITY.ADMIN_CHANGE_PASSWORD(patientId),
    request,
  );
};

export function EditPatientPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editPatientPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
      toast.success("Patient password updated successfully");
    },
    onError: () => {
      toast.error("Failed to update patient password");
    },
  });
}
