import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  API_ENDPOINTS,
  handleApiError,
  type ProblemDetailsDto,
} from "@/index";

const markAllNotificationsRead = () => {
  return api.post<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATIONS_AS_READ);
};

export function MarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
