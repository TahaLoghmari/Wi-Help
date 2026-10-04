import type { Href } from "expo-router";
import { ROUTE_PATHS } from "@/app-composition/routes";
import type { ConversationDto } from "@/features/messaging/api";
import type { PatientDto } from "@/features/patients/api";

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
