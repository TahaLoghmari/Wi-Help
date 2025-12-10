import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";

const deleteReviewForAdmin = (reviewId: string) => {
  return api.delete(API_ENDPOINTS.REVIEWS.DELETE_AS_ADMIN(reviewId));
};

export function useDeleteReviewForAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewForAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
}
