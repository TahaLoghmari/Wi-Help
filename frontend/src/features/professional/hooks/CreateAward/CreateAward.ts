import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { CreateAwardRequest } from "./CreateAwardRequest";
import type { GetAwardsDto } from "../GetAwards";
import i18n from "i18next";

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
      toast.success(i18n.t("toasts.professional.awardAdded"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
