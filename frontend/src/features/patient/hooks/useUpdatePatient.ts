import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import { toFormData } from "@/lib/utils";
import type { UpdatePatientDto } from "@/features/patient";

export const updatePatient = (credentials: UpdatePatientDto) => {
  const formData = toFormData(credentials);

  return api.put<void>(API_ENDPOINTS.PATIENTS.UPDATE_PATIENT, formData);
};

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, UpdatePatientDto>({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["currentPatient"] });
      toast.success("Account updated successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
