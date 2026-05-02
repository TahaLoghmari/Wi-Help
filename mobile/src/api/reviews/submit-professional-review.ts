import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { reviewKeys } from "./keys";

interface SubmitProfessionalReviewRequest {
  professionalId: string;
  comment: string;
  rating: number;
}

function submitProfessionalReview(data: SubmitProfessionalReviewRequest) {
  return api.post(API_ENDPOINTS.REVIEWS.SUBMIT_REVIEW, {
    subjectId: data.professionalId,
    comment: data.comment,
    rating: data.rating,
  });
}

export function useSubmitProfessionalReview(professionalId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitProfessionalReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviews(professionalId),
      });
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.patientReviewStats(professionalId),
      });
    },
  });
}
