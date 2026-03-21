import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { CreateEducationRequest } from "./CreateEducationRequest";
import type { GetEducationsDto } from "../GetEducations";
import i18n from "i18next";

const createEducation = (request: CreateEducationRequest) => {
  return api.post<GetEducationsDto>(
    API_ENDPOINTS.PROFESSIONALS.CREATE_EDUCATION,
    request,
  );
};

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation<
    GetEducationsDto,
    ProblemDetailsDto,
    CreateEducationRequest
  >({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      toast.success(i18n.t("toasts.professional.educationAdded"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
