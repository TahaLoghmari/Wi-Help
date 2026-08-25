import { router } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";
import { MessagesScreen } from "@/features/messaging";

export default function ProfessionalMessagesRoute() {
  return (
    <MessagesScreen
      onOpenConversation={(id) =>
        router.push({
          pathname: ROUTE_PATHS.PROFESSIONAL.CONVERSATION_PATHNAME,
          params: { id },
        })
      }
    />
  );
}
