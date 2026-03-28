import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { messagingKeys } from "./keys";
import { type ConversationDto } from "@/features/messaging/types/messaging.types";

function getConversations() {
  return api.get<ConversationDto[]>(API_ENDPOINTS.MESSAGING.GET_CONVERSATIONS);
}

export function useGetConversations() {
  return useQuery<ConversationDto[]>({
    queryKey: messagingKeys.conversations,
    queryFn: getConversations,
  });
}
