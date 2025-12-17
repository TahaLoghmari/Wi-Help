import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import type { SubmitPatientReviewRequest } from "@/features/reviews";
import type { ProblemDetailsDto } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleApiError } from "@/hooks";

const submitPatientReview = (request: SubmitPatientReviewRequest) => {
  return api.post<void>("/reviews/patient", request);
};

export function useSubmitPatientReview() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, ProblemDetailsDto, SubmitPatientReviewRequest>({
    mutationFn: submitPatientReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patient-reviews", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-review-stats", variables.patientId],
      });
      toast.success(t("reviews.submitSuccess"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
