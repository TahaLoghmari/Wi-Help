import { render, screen, fireEvent } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text as MockText, Pressable as MockPressable } from "react-native";
import AppointmentRoute from "@/app/(professional)/appointment/[id]";
import ConversationRoute from "@/app/(professional)/conversation/[id]";
import PatientRoute from "@/app/(professional)/patient/[id]";
import { ROUTE_PATHS } from "./routes";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn(), push: jest.fn(), navigate: jest.fn() },
}));
jest.mock("@/features/appointments", () => ({
  AppointmentDetailScreen: ({
    id,
    onBack,
    onOpenPatient,
  }: {
    id: string;
    onBack: () => void;
    onOpenPatient: (id: string) => void;
  }) => (
    <>
      <MockText>{id}</MockText>
      <MockPressable onPress={onBack}>
        <MockText>Back</MockText>
      </MockPressable>
      <MockPressable onPress={() => onOpenPatient("patient-1")}>
        <MockText>Patient</MockText>
      </MockPressable>
    </>
  ),
}));
jest.mock("@/features/messaging", () => ({
  ConversationScreen: ({
    conversationId,
    onBack,
  }: {
    conversationId: string;
    onBack: () => void;
  }) => (
    <>
      <MockText>{conversationId}</MockText>
      <MockPressable onPress={onBack}>
        <MockText>Back</MockText>
      </MockPressable>
    </>
  ),
}));
jest.mock("./profile-reviews", () => ({
  PatientProfileComposition: ({
    patientId,
    onBack,
  }: {
    patientId: string;
    onBack: () => void;
  }) => (
    <>
      <MockText>{patientId}</MockText>
      <MockPressable onPress={onBack}>
        <MockText>Back</MockText>
      </MockPressable>
    </>
  ),
}));

describe("dynamic route contracts", () => {
  beforeEach(() => jest.clearAllMocks());

  it("passes appointment id and preserves patient navigation and back", async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ id: "appointment-1" });
    await render(<AppointmentRoute />);
    expect(screen.getByText("appointment-1")).toBeTruthy();
    await fireEvent.press(screen.getByText("Patient"));
    expect(router.push).toHaveBeenCalledWith({
      pathname: ROUTE_PATHS.PROFESSIONAL.PATIENT_PROFILE_PATHNAME,
      params: { id: "patient-1" },
    });
    await fireEvent.press(screen.getByText("Back"));
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it("passes only canonical conversation id, not query-string participant metadata", async () => {
    jest
      .mocked(useLocalSearchParams)
      .mockReturnValue({ id: "conversation-1", firstName: "untrusted" });
    await render(<ConversationRoute />);
    expect(screen.getByText("conversation-1")).toBeTruthy();
    expect(screen.queryByText("untrusted")).toBeNull();
    await fireEvent.press(screen.getByText("Back"));
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it.each([undefined, ROUTE_PATHS.PROFESSIONAL.PATIENTS])(
    "preserves patient backRoute %s",
    async (backRoute) => {
      jest
        .mocked(useLocalSearchParams)
        .mockReturnValue({
          id: "patient-1",
          ...(backRoute ? { backRoute } : {}),
        });
      await render(<PatientRoute />);
      expect(screen.getByText("patient-1")).toBeTruthy();
      await fireEvent.press(screen.getByText("Back"));
      if (backRoute) expect(router.navigate).toHaveBeenCalledWith(backRoute);
      else expect(router.back).toHaveBeenCalledTimes(1);
    },
  );
});
