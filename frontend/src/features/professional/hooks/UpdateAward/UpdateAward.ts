import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { UpdateAwardRequest } from "./UpdateAwardRequest";
import type { GetAwardsDto } from "../GetAwards";

interface UpdateAwardParams {
  awardId: string;
  request: UpdateAwardRequest;
}

const updateAward = ({ awardId, request }: UpdateAwardParams) => {
  return api.put<GetAwardsDto>(
    API_ENDPOINTS.PROFESSIONALS.UPDATE_AWARD(awardId),
    request,
  );
};

export function useUpdateAward() {
  const queryClient = useQueryClient();
  return useMutation<GetAwardsDto, ProblemDetailsDto, UpdateAwardParams>({
    mutationFn: updateAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Award updated successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
