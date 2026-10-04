import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { NOTIFICATION_ENDPOINTS } from "./endpoints";
import { notificationKeys } from "./keys";
import {
  markNotificationRead,
  type NotificationsData,
} from "./notification-cache";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const queryKey = notificationKeys.all;

  return useMutation({
    mutationFn: (id: string) =>
      api.post<void>(NOTIFICATION_ENDPOINTS.MARK_NOTIFICATION_AS_READ(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<NotificationsData>(queryKey);
      queryClient.setQueryData<NotificationsData>(queryKey, (old) =>
        markNotificationRead(old, id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
