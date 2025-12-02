import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { CreateAwardRequest } from "./CreateAwardRequest";
import type { GetAwardsDto } from "../GetAwards";

const createAward = (request: CreateAwardRequest) => {
  return api.post<GetAwardsDto>(
    API_ENDPOINTS.PROFESSIONALS.CREATE_AWARD,
    request,
  );
};

export function useCreateAward() {
  const queryClient = useQueryClient();
  return useMutation<GetAwardsDto, ProblemDetailsDto, CreateAwardRequest>({
    mutationFn: createAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Award added successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
