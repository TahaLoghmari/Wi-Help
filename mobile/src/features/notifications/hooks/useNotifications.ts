import { useCallback } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type PaginationResultDto } from "@/types/enums.types";
import {
  NotificationType,
  type NotificationDto,
} from "@/features/notifications/types/api.types";

export type NotificationFilter =
  | "all"
  | "appointments"
  | "messages"
  | "reviews";

// All appointment-related notification types for client-side filtering
const APPOINTMENT_TYPES: string[] = [
  NotificationType.newAppointment,
  NotificationType.appointmentAccepted,
  NotificationType.appointmentRejected,
  NotificationType.appointmentCancelled,
  NotificationType.appointmentCompleted,
  NotificationType.newPrescription,
  NotificationType.appointmentStatusUpdated,
];

// Single stable query key — the backend has no type-filter support;
// filtering is done client-side to match the web app behaviour.
const QUERY_KEY = ["notifications"] as const;

function fetchNotifications(page: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  return api.get<PaginationResultDto<NotificationDto>>(
    `${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}?${params.toString()}`,
  );
}

export function useNotifications(filter: NotificationFilter = "all") {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEY;

  const query = useInfiniteQuery<PaginationResultDto<NotificationDto>>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });

  // ── Mark single notification as read (optimistic) ──────────────────────────

  const markAsReadMutation = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["notifications", "badge"] });
    },
  });

  // ── Mark all notifications as read (optimistic) ────────────────────────────

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      api.post<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATIONS_AS_READ),
    onMutate: async () => {
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
            items: page.items.map((item) => ({ ...item, isRead: true })),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "badge"] });
    },
  });

  const markAsRead = useCallback(
    (id: string) => markAsReadMutation.mutate(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markAsReadMutation.mutate],
  );

  const markAllAsRead = useCallback(
    () => markAllAsReadMutation.mutate(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markAllAsReadMutation.mutate],
  );

  const allNotifications = query.data?.pages.flatMap((p) => p.items) ?? [];
  const hasUnread = allNotifications.some((n) => !n.isRead);

  // Client-side filtering — keeps infinite scroll cache shared across all tabs
  const filteredNotifications =
    filter === "all"
      ? allNotifications
      : filter === "appointments"
        ? allNotifications.filter((n) => APPOINTMENT_TYPES.includes(n.type))
        : filter === "messages"
          ? allNotifications.filter(
              (n) => n.type === NotificationType.newMessage,
            )
          : allNotifications.filter(
              (n) => n.type === NotificationType.newReview,
            );

  return {
    ...query,
    allNotifications,
    filteredNotifications,
    hasUnread,
    markAsRead,
    markAllAsRead,
  };
}
