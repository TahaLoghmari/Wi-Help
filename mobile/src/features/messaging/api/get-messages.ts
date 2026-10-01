import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { MESSAGING_ENDPOINTS } from "@/features/messaging/api/endpoints";
import { messagingKeys } from "./keys";
import { type MessagesResponseDto } from "./contracts";

function getMessages(
  conversationId: string,
  pageNumber: number,
  pageSize: number,
) {
  const url = `${MESSAGING_ENDPOINTS.GET_MESSAGES(conversationId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
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
