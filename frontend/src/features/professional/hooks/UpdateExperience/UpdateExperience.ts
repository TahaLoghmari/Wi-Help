import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { UpdateExperienceRequest } from "./UpdateExperienceRequest";
import type { GetExperiencesDto } from "../GetExperiences";
import i18n from "i18next";

interface UpdateExperienceParams {
  experienceId: string;
  request: UpdateExperienceRequest;
}

const updateExperience = ({
  experienceId,
  request,
}: UpdateExperienceParams) => {
  return api.patch<GetExperiencesDto>(
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
      toast.success(i18n.t("toasts.professional.experienceUpdated"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
