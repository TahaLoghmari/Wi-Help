import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { notificationKeys } from "./keys";
import {
  markAllNotificationsRead,
  type NotificationsData,
} from "./notification-cache";

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const queryKey = notificationKeys.all;

  return useMutation({
    mutationFn: () =>
      api.post<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATIONS_AS_READ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<NotificationsData>(queryKey);
      queryClient.setQueryData<NotificationsData>(queryKey, (old) =>
        markAllNotificationsRead(old),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
