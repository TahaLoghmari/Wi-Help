import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { messagingKeys } from "./keys";
import { type MessagesResponseDto } from "@/features/messaging/types/messaging.types";

function getMessages(
  conversationId: string,
  pageNumber: number,
  pageSize: number,
) {
  const url = `${API_ENDPOINTS.MESSAGING.GET_MESSAGES(conversationId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return api.get<MessagesResponseDto>(url);
}

export function useGetMessages(conversationId: string) {
  return useInfiniteQuery<MessagesResponseDto>({
    queryKey: messagingKeys.messages(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      getMessages(conversationId, pageParam as number, 50),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber < lastPage.totalPages
        ? lastPage.pageNumber + 1
        : undefined,
    enabled: !!conversationId,
    staleTime: 10_000,
  });
}
