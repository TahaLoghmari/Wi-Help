import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { toFormData } from "@/lib";
import type { UpdateProfessionalRequest } from "@/features/professional";

export const updateProfessional = (request: UpdateProfessionalRequest) => {
  const formData = toFormData(request);
  return api.put<void>(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_PROFESSIONAL,
    formData,
  );
};

export function UpdateProfessional() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, UpdateProfessionalRequest>({
    mutationFn: updateProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["currentProfessional"] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Account updated successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
