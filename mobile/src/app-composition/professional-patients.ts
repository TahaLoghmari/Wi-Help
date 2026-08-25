import type { Href } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";
import type { ConversationDto } from "@/entities/messaging";
import type { PatientDto } from "@/entities/patient";

export function getProfessionalPatientMessageRoute(
  patient: PatientDto,
  conversations: readonly ConversationDto[],
): Href {
  const conversation = conversations.find(
    ({ otherParticipantId }) => otherParticipantId === patient.userId,
  );

  if (!conversation) return ROUTE_PATHS.PROFESSIONAL.MESSAGES;

  return {
    pathname: ROUTE_PATHS.PROFESSIONAL.CONVERSATION_PATHNAME,
    params: { id: conversation.id },
  };
}
