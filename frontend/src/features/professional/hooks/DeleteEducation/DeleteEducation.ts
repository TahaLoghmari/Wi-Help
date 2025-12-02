import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

const deleteEducation = (educationId: string) => {
  return api.delete<void>(
    API_ENDPOINTS.PROFESSIONALS.DELETE_EDUCATION(educationId),
  );
};

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      toast.success("Education deleted successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
