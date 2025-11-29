import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { MessagesResponseDto, GetMessagesRequest } from "@/features/messaging";

const getMessages = (request: GetMessagesRequest) => {
  const { conversationId, pageNumber = 1, pageSize = 50 } = request;
  const url = `${API_ENDPOINTS.MESSAGING.GET_MESSAGES(conversationId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return api.get<MessagesResponseDto>(url);
};

export function GetMessages(request: GetMessagesRequest) {
  return useInfiniteQuery<MessagesResponseDto>({
    queryKey: ["messages", request.conversationId],
    queryFn: ({ pageParam = 1 }) =>
      getMessages({
        ...request,
        pageNumber: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pageNumber < lastPage.totalPages
        ? lastPage.pageNumber + 1
        : undefined;
    },
    enabled: !!request.conversationId,
  });
}

