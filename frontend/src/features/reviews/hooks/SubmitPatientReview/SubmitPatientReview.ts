import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleApiError } from "@/hooks";

export interface SubmitPatientReviewRequest {
  patientId: string;
  comment: string;
  rating: number;
}

const submitPatientReview = (request: SubmitPatientReviewRequest) => {
  return api.post<void>(API_ENDPOINTS.REVIEWS.SUBMIT_REVIEW, {
    subjectId: request.patientId,
    comment: request.comment,
    rating: request.rating,
  });
};

export function useSubmitPatientReview() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, ProblemDetailsDto, SubmitPatientReviewRequest>({
    mutationFn: submitPatientReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-stats"] });
      toast.success(t("reviews.submitSuccess"));
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
