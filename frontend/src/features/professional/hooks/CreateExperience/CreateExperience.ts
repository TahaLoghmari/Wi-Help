import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { CreateExperienceRequest } from "./CreateExperienceRequest";
import type { GetExperiencesDto } from "../GetExperiences";

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
      toast.success("Experience added successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
