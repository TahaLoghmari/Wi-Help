import { useInfiniteQuery } from "@tanstack/react-query";
import {
  api,
  API_ENDPOINTS,
  toQueryString,
  type PaginationResultDto,
} from "@/index";
import type {
  GetNotificationsRequest,
  GetNotificationsDto,
} from "@/features/notifications";

export const getNotifications = (request: GetNotificationsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetNotificationsDto>>(
    `${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}/?${queryString}`,
  );
};

export function GetNotifications() {
  return useInfiniteQuery<PaginationResultDto<GetNotificationsDto>>({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) =>
      getNotifications({
        page: pageParam as number,
        pageSize: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
