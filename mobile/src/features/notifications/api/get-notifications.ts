import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { NOTIFICATION_ENDPOINTS } from "./endpoints";
import { type PaginationResultDto } from "@/shared/api/enums.types";
import { notificationKeys } from "./keys";
import { type NotificationDto } from "./notification.types";

function fetchNotifications(page: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  return api.get<PaginationResultDto<NotificationDto>>(
    `${NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS}?${params.toString()}`,
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
