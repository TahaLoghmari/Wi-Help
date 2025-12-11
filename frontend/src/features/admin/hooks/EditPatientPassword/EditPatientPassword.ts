import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

interface EditPatientPasswordParams {
  userId: string;
  newPassword: string;
}

const editPatientPassword = ({
  userId,
  newPassword,
}: EditPatientPasswordParams) => {
  const queryParams = new URLSearchParams({ NewPassword: newPassword });
  return api.patch(
    `${API_ENDPOINTS.IDENTITY.ADMIN_CHANGE_PASSWORD(userId)}?${queryParams.toString()}`,
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
