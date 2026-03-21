import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { toFormData } from "@/lib/utils";
import type { UpdatePatientRequest } from "@/features/patient";
import i18n from "i18next";

export const updatePatient = (credentials: UpdatePatientRequest) => {
  const formData = toFormData(credentials);
  return api.patch<void>(API_ENDPOINTS.PATIENTS.UPDATE_PATIENT, formData);
};

export function UpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, UpdatePatientRequest>({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["currentPatient"] });
      toast.success(i18n.t("toasts.patient.accountUpdated"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
