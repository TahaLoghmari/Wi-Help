import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type PaginationResultDto } from "@/types/enums.types";
import { type NotificationDto } from "@/features/notifications/types/notifications.types";
import { notificationKeys } from "./keys";

function fetchNotifications(page: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  return api.get<PaginationResultDto<NotificationDto>>(
    `${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}?${params.toString()}`,
  );
}

export function useNotifications() {
  return useInfiniteQuery<PaginationResultDto<NotificationDto>>({
    queryKey: notificationKeys.all,
    queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });
}
