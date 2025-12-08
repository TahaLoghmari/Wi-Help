import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { EditPasswordRequest } from "@/features/admin";
import { toast } from "sonner";

interface EditProfessionalPasswordParams {
  professionalId: string;
  newPassword: string;
}

const editProfessionalPassword = ({
  professionalId,
  newPassword,
}: EditProfessionalPasswordParams) => {
  const request: EditPasswordRequest = { newPassword };
  return api.patch(
    API_ENDPOINTS.IDENTITY.ADMIN_CHANGE_PASSWORD(professionalId),
    request,
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
