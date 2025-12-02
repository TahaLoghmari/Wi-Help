import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { UpdateExperienceRequest } from "./UpdateExperienceRequest";
import type { GetExperiencesDto } from "../GetExperiences";

interface UpdateExperienceParams {
  experienceId: string;
  request: UpdateExperienceRequest;
}

const updateExperience = ({
  experienceId,
  request,
}: UpdateExperienceParams) => {
  return api.put<GetExperiencesDto>(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_EXPERIENCE(experienceId),
    request,
  );
};

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation<
    GetExperiencesDto,
    ProblemDetailsDto,
    UpdateExperienceParams
  >({
    mutationFn: updateExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience updated successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
