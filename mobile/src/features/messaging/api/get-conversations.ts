import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { MESSAGING_ENDPOINTS } from "@/features/messaging/api/endpoints";
import { messagingKeys } from "./keys";
import { type ConversationDto } from "./contracts";

function getConversations() {
  return api.get<ConversationDto[]>(MESSAGING_ENDPOINTS.GET_CONVERSATIONS);
}

export function useGetConversations() {
  return useQuery<ConversationDto[]>({
    queryKey: messagingKeys.conversations,
    queryFn: getConversations,
  });
}
