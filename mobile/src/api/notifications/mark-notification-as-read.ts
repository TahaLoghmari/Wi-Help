import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type PaginationResultDto } from "@/types/enums.types";
import { type NotificationDto } from "@/features/notifications/types/notifications.types";
import { notificationKeys } from "./keys";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const queryKey = notificationKeys.all;

  return useMutation({
    mutationFn: (id: string) =>
      api.post<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATION_AS_READ(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const data = old as {
          pages: PaginationResultDto<NotificationDto>[];
          pageParams: unknown[];
        };
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === id ? { ...item, isRead: true } : item,
            ),
          })),
        };
      });
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
