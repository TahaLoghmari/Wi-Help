import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";

const deletePrescriptionForAdmin = (prescriptionId: string) => {
  return api.delete(
    API_ENDPOINTS.APPOINTMENTS.DELETE_PRESCRIPTION_AS_ADMIN(prescriptionId),
  );
};

export function useDeletePrescriptionForAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrescriptionForAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prescriptions"] });
    },
  });
}
