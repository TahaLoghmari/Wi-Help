import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  API_ENDPOINTS,
  handleApiError,
  type ProblemDetailsDto,
} from "@/index";
import type { MarkNotificationAsReadRequest } from "@/features/notifications";

const markNotificationRead = (request: MarkNotificationAsReadRequest) => {
  return api.post<void>(
    API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATION_AS_READ(
      request.notificationId,
    ),
  );
};

export function MarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, MarkNotificationAsReadRequest>({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
