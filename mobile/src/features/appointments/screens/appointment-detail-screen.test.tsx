import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import {
  AppointmentStatus,
  AppointmentUrgency,
  type AppointmentDto,
} from "@/features/appointments/api";
import { AppointmentDetailScreen } from "./appointment-detail-screen";

const mockCancelMutate = jest.fn();
const mockCompleteMutate = jest.fn();
const mockHandleApiError = jest.fn();

jest.mock("@/features/appointments/api", () => {
  const actual = jest.requireActual("@/features/appointments/api");
  return {
    ...actual,
    useGetAppointmentById: jest.fn(),
    useRespondToAppointment: () => ({ mutate: jest.fn(), isPending: false }),
    useCancelAppointmentByProfessional: () => ({ mutate: mockCancelMutate, isPending: false }),
    useCompleteAppointment: () => ({ mutate: mockCompleteMutate, isPending: false }),
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));
jest.mock("@/shared/hooks/use-handle-api-error", () => ({
  useHandleApiError: () => mockHandleApiError,
}));
jest.mock("@/features/appointments/components/complete-appointment-modal", () => ({
  CompleteAppointmentModal: ({ visible, onSubmit }: {
    visible: boolean;
    onSubmit: (values: object) => void;
  }) => {
    const { Pressable, Text } = jest.requireActual("react-native");
    if (!visible) return null;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Submit completion"
        onPress={() => onSubmit({
          prescriptionPdf: {
            uri: "file:///prescription.pdf",
            name: "prescription.pdf",
            type: "application/pdf",
          },
          prescriptionTitle: "Care plan",
        })}
      >
        <Text>Submit completion</Text>
      </Pressable>
    );
  },
}));

const appointment: AppointmentDto = {
  id: "appointment-1",
  patientId: "patient-1",
  professionalId: "professional-1",
  startDate: "2026-08-30T10:00:00.000Z",
  endDate: "2026-08-30T11:00:00.000Z",
  urgency: AppointmentUrgency.Low,
  status: AppointmentStatus.Confirmed,
  price: 80,
  offeredAt: "2026-08-29T10:00:00.000Z",
  confirmedAt: "2026-08-29T11:00:00.000Z",
  createdAt: "2026-08-29T10:00:00.000Z",
  updatedAt: "2026-08-29T11:00:00.000Z",
  patient: {
    id: "patient-1",
    userId: "user-1",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phoneNumber: "123",
    dateOfBirth: "1990-01-01T00:00:00.000Z",
    gender: "Female",
  },
};

describe("AppointmentDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useGetAppointmentById } = jest.requireMock("@/features/appointments/api");
    useGetAppointmentById.mockReturnValue({ data: appointment, isPending: false, isError: false });
  });

  it("cancels a confirmed appointment and returns after the existing success toast", async () => {
    const onBack = jest.fn();
    mockCancelMutate.mockImplementation((_payload, options) => options.onSuccess());
    await render(
      <AppointmentDetailScreen
        id="appointment-1"
        onBack={onBack}
        onOpenPatient={jest.fn()}
      />,
    );

    const user = userEvent.setup();
    await user.press(await screen.findByRole("button", { name: "Cancel appointment" }));
    await user.press(screen.getByRole("button", {
      name: "professional.dashboard.appointments.confirmCancel.confirm",
    }));

    await waitFor(() => expect(mockCancelMutate).toHaveBeenCalledWith(
      "appointment-1",
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    ));
    expect(Toast.show).toHaveBeenCalledWith({
      type: "success",
      text1: "Appointment cancelled",
    });
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("completes an appointment with the modal values and returns after success", async () => {
    const onBack = jest.fn();
    mockCompleteMutate.mockImplementation((_payload, options) => options.onSuccess());
    await render(
      <AppointmentDetailScreen
        id="appointment-1"
        onBack={onBack}
        onOpenPatient={jest.fn()}
      />,
    );

    const user = userEvent.setup();
    await user.press(await screen.findByRole("button", { name: "Complete appointment" }));
    await user.press(screen.getByRole("button", { name: "Submit completion" }));

    await waitFor(() => expect(mockCompleteMutate).toHaveBeenCalledWith(
      {
        appointmentId: "appointment-1",
        prescriptionPdf: {
          uri: "file:///prescription.pdf",
          name: "prescription.pdf",
          type: "application/pdf",
        },
        prescriptionTitle: "Care plan",
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: mockHandleApiError,
      }),
    ));
    expect(Toast.show).toHaveBeenCalledWith({
      type: "success",
      text1: "Appointment completed",
    });
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
