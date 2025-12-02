import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

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
      toast.success("Experience deleted successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
