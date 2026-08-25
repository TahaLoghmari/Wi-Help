import { router, useLocalSearchParams } from "expo-router";
import { ConversationScreen } from "@/features/messaging";

export default function ConversationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ConversationScreen
      conversationId={id}
      onBack={() => router.back()}
    />
  );
}
