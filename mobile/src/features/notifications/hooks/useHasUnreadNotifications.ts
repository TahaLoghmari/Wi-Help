import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type PaginationResultDto } from "@/types/enums.types";
import { type NotificationDto } from "@/features/notifications/types/api.types";

export function useHasUnreadNotifications() {
  const { data } = useQuery({
    queryKey: ["notifications", "badge"],
    queryFn: () =>
      api.get<PaginationResultDto<NotificationDto>>(
        `${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}?page=1&pageSize=20`,
      ),
    staleTime: 60 * 1000,
  });

  return {
    hasUnread: data?.items.some((n) => !n.isRead) ?? false,
  };
}
