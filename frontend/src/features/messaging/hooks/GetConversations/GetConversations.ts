import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { ConversationDto } from "@/features/messaging";

const getConversations = () => {
  return api.get<ConversationDto[]>(API_ENDPOINTS.MESSAGING.GET_CONVERSATIONS);
};

export function GetConversations() {
  return useQuery<ConversationDto[]>({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
}

