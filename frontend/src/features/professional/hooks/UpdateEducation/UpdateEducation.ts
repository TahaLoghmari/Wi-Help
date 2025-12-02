import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { UpdateEducationRequest } from "./UpdateEducationRequest";
import type { GetEducationsDto } from "../GetEducations";

interface UpdateEducationParams {
  educationId: string;
  request: UpdateEducationRequest;
}

const updateEducation = ({ educationId, request }: UpdateEducationParams) => {
  return api.put<GetEducationsDto>(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_EDUCATION(educationId),
    request,
  );
};

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation<
    GetEducationsDto,
    ProblemDetailsDto,
    UpdateEducationParams
  >({
    mutationFn: updateEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      toast.success("Education updated successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
