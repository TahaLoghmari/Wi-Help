import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import i18n from "i18next";

const deleteAward = (awardId: string) => {
  return api.delete<void>(API_ENDPOINTS.PROFESSIONALS.DELETE_AWARD(awardId));
};

export function useDeleteAward() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: deleteAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success(i18n.t("toasts.professional.awardDeleted"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
