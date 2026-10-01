import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { NOTIFICATION_ENDPOINTS } from "./endpoints";
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
      api.post<void>(NOTIFICATION_ENDPOINTS.MARK_NOTIFICATIONS_AS_READ),
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
