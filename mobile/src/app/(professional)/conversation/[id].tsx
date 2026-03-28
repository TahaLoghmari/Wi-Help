import { useLocalSearchParams } from "expo-router";
import { ConversationScreen } from "@/features/messaging/components/conversation-screen";

export default function ConversationRoute() {
  const {
    id,
    participantId,
    firstName,
    lastName,
    profilePictureUrl,
    backRoute,
  } = useLocalSearchParams<{
    id: string;
    participantId: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
    backRoute?: string;
  }>();

  return (
    <ConversationScreen
      conversationId={id}
      participantId={participantId}
      firstName={firstName}
      lastName={lastName}
      profilePictureUrl={profilePictureUrl}
      backRoute={backRoute}
    />
  );
}
