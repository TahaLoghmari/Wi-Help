import { router } from "expo-router";
import { ProfessionalAppHeader } from "@/app-composition/professional-app-header";
import { ROUTE_PATHS } from "@/config/routes";
import { MessagesScreen } from "@/features/messaging";

export default function ProfessionalMessagesRoute() {
  return (
    <MessagesScreen
      renderHeader={(scrollY) => <ProfessionalAppHeader scrollY={scrollY} />}
      onOpenConversation={(id) =>
        router.push({
          pathname: ROUTE_PATHS.PROFESSIONAL.CONVERSATION_PATHNAME,
          params: { id },
        })
      }
    />
  );
}
