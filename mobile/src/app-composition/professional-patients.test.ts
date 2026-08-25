import type { ConversationDto } from "@/entities/messaging";
import type { PatientDto } from "@/entities/patient";
import { getProfessionalPatientMessageRoute } from "./professional-patients";

const patient = {
  id: "patient-record-1",
  userId: "patient-user-1",
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phoneNumber: "+1234567890",
  dateOfBirth: "1815-12-10",
  gender: "Female",
  address: {},
  profilePictureUrl: undefined,
} as PatientDto;

const conversation = {
  id: "conversation-1",
  otherParticipantId: patient.userId,
} as ConversationDto;

describe("getProfessionalPatientMessageRoute", () => {
  it("projects a matching participant to the conversation route and falls back to messages", () => {
    expect(
      getProfessionalPatientMessageRoute(patient, [conversation]),
    ).toEqual({
      pathname: "/(professional)/conversation/[id]",
      params: { id: "conversation-1" },
    });

    expect(getProfessionalPatientMessageRoute(patient, [])).toBe(
      "/(professional)/messages",
    );
  });
});
