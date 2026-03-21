import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import i18n from "i18next";

const deleteExperience = (experienceId: string) => {
  return api.delete<void>(
    API_ENDPOINTS.PROFESSIONALS.DELETE_EXPERIENCE(experienceId),
  );
};

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success(i18n.t("toasts.professional.experienceDeleted"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
