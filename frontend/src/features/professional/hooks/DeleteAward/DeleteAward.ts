import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

const deleteAward = (awardId: string) => {
  return api.delete<void>(API_ENDPOINTS.PROFESSIONALS.DELETE_AWARD(awardId));
};

export function useDeleteAward() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: deleteAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Award deleted successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
