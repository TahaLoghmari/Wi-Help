import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { CreateExperienceRequest } from "./CreateExperienceRequest";
import type { GetExperiencesDto } from "../GetExperiences";
import i18n from "i18next";

const createExperience = (request: CreateExperienceRequest) => {
  return api.post<GetExperiencesDto>(
    API_ENDPOINTS.PROFESSIONALS.CREATE_EXPERIENCE,
    request,
  );
};

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation<
    GetExperiencesDto,
    ProblemDetailsDto,
    CreateExperienceRequest
  >({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success(i18n.t("toasts.professional.experienceAdded"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
