import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

interface EditProfessionalPasswordParams {
  userId: string;
  newPassword: string;
}

const editProfessionalPassword = ({
  userId,
  newPassword,
}: EditProfessionalPasswordParams) => {
  const queryParams = new URLSearchParams({ NewPassword: newPassword });
  return api.patch(
    `${API_ENDPOINTS.IDENTITY.ADMIN_CHANGE_PASSWORD(userId)}?${queryParams.toString()}`,
  );
};

export function EditProfessionalPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProfessionalPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-professionals"] });
      toast.success("Professional password updated successfully");
    },
    onError: () => {
      toast.error("Failed to update professional password");
    },
  });
}
