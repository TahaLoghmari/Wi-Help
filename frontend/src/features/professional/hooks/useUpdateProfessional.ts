import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import type { UpdateProfessionalDto } from "@/features/professional";
import { toFormData } from "@/lib/utils";

export const updateProfessional = (credentials: UpdateProfessionalDto) => {
  const formData = toFormData(credentials);

  return api.put<void>(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_PROFESSIONAL,
    formData,
  );
};

export function useUpdateProfessional() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, UpdateProfessionalDto>({
    mutationFn: updateProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["currentProfessional"] });
      toast.success("Account updated successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
