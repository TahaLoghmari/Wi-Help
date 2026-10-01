import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import {
  AppointmentStatus,
  AppointmentUrgency,
  type AppointmentDto,
} from "@/features/appointments/api";
import { AppointmentsScreen } from "./appointments-screen";

const mockRespondMutate = jest.fn();
const mockHandleApiError = jest.fn();

jest.mock("react-native-reanimated", () => {
  const { FlatList } = jest.requireActual("react-native");
  return {
    __esModule: true,
    default: { FlatList },
    useAnimatedScrollHandler: () => jest.fn(),
    useSharedValue: (value: number) => ({ value }),
  };
});

jest.mock("@/features/auth/session", () => ({
  useCurrentUser: () => ({ data: { lastName: "Hopper" } }),
}));

jest.mock("@/features/appointments/api", () => {
  const actual = jest.requireActual("@/features/appointments/api");
  return {
    ...actual,
    useGetProfessionalAppointments: jest.fn(),
    useRespondToAppointment: () => ({ mutate: mockRespondMutate, isPending: false }),
    useCancelAppointmentByProfessional: () => ({ mutate: jest.fn(), isPending: false }),
    useCompleteAppointment: () => ({ mutate: jest.fn(), isPending: false }),
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
  CompleteAppointmentModal: () => null,
}));

const appointment: AppointmentDto = {
  id: "appointment-1",
  patientId: "patient-1",
  professionalId: "professional-1",
  startDate: "2026-08-30T10:00:00.000Z",
  endDate: "2026-08-30T11:00:00.000Z",
  urgency: AppointmentUrgency.Low,
  status: AppointmentStatus.Offered,
  price: 80,
  offeredAt: "2026-08-29T10:00:00.000Z",
  createdAt: "2026-08-29T10:00:00.000Z",
  updatedAt: "2026-08-29T10:00:00.000Z",
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

describe("AppointmentsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useGetProfessionalAppointments } = jest.requireMock("@/features/appointments/api");
    useGetProfessionalAppointments.mockReturnValue({
      data: { pages: [{ items: [appointment] }] },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });
  });

  it("accepts an offered appointment with the existing payload and success toast", async () => {
    mockRespondMutate.mockImplementation((_payload, options) => options.onSuccess());
    await render(<AppointmentsScreen onOpenAppointment={jest.fn()} />);

    const user = userEvent.setup();
    await user.press(await screen.findByRole("button", { name: "Accept appointment" }));
    await user.press(screen.getByRole("button", {
      name: "professional.dashboard.appointments.confirmAccept.confirm",
    }));

    await waitFor(() => expect(mockRespondMutate).toHaveBeenCalledWith(
      { appointmentId: "appointment-1", isAccepted: true },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: mockHandleApiError,
      }),
    ));
    expect(Toast.show).toHaveBeenCalledWith({
      type: "success",
      text1: "Appointment accepted",
    });
  });
});
