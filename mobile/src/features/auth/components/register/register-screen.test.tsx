import React from "react";
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import { RegisterScreen } from "./register-screen";

const mockGoBack = jest.fn();
const mockGoToLogin = jest.fn();
const mockHandleApiError = jest.fn();
const mockPatientMutate = jest.fn();
const mockProfessionalMutate = jest.fn();
const mockResetPatient = jest.fn();
const mockResetProfessional = jest.fn();
const mockTriggerPatient = jest.fn();
const mockTriggerProfessional = jest.fn();
const mockUseForm = jest.fn();

const commonFormData = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  password: "Password1!",
  confirmPassword: "Password1!",
  gender: "Female",
  dateOfBirth: "10/12/1815",
  phoneNumber: "+15551234567",
  address: {
    street: "1 Example Street",
    city: "London",
    postalCode: "SW1A 1AA",
    countryId: "gb",
    stateId: "london",
  },
};

const patientFormData = {
  ...commonFormData,
  emergencyContact: {
    fullName: "Charles Babbage",
    phoneNumber: "+15550000000",
    relationshipId: "friend",
  },
};

const professionalFormData = {
  ...commonFormData,
  specializationId: "specialization-1",
  experience: 10,
};

jest.mock("react-hook-form", () => ({
  useForm: (...args: unknown[]) => mockUseForm(...args),
}));

jest.mock("@/features/auth/api/register-patient", () => ({
  useRegisterPatient: () => ({ mutate: mockPatientMutate, isPending: false }),
}));

jest.mock("@/features/auth/api/register-professional", () => ({
  useRegisterProfessional: () => ({
    mutate: mockProfessionalMutate,
    isPending: false,
  }),
}));

jest.mock("@/hooks/use-handle-api-error", () => ({
  useHandleApiError: jest.fn(() => mockHandleApiError),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: () => null,
}));

jest.mock("./step-1-form", () => ({ Step1Form: () => null }));
jest.mock("./step-2-form", () => ({ Step2Form: () => null }));
jest.mock("./step-3-patient-form", () => ({
  Step3PatientForm: () => null,
}));
jest.mock("./step-3-professional-form", () => ({
  Step3ProfessionalForm: () => null,
}));

describe("RegisterScreen registration orchestration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForm.mockReset().mockImplementation(
      ({ defaultValues }: { defaultValues: typeof patientFormData }) => {
        if ("emergencyContact" in defaultValues) {
          return {
            reset: mockResetPatient,
            trigger: mockTriggerPatient,
            handleSubmit: (
              submit: (data: typeof patientFormData) => void,
            ) => () => submit(patientFormData),
          };
        }

        return {
          reset: mockResetProfessional,
          trigger: mockTriggerProfessional,
          handleSubmit: (
            submit: (data: typeof professionalFormData) => void,
          ) => () => submit(professionalFormData),
        };
      },
    );
    mockTriggerPatient.mockResolvedValue(true);
    mockTriggerProfessional.mockResolvedValue(true);
  });

  async function advanceToSubmit() {
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "common.continue" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "common.back" })).toBeTruthy(),
    );

    await user.press(screen.getByRole("button", { name: "common.continue" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "common.register" }),
      ).toBeTruthy(),
    );
  }

  function renderRegisterScreen() {
    return render(
      <RegisterScreen onBack={mockGoBack} onLogin={mockGoToLogin} />,
    );
  }

  it("does not advance when the active form step is invalid", async () => {
    mockTriggerPatient.mockResolvedValueOnce(false);
    await renderRegisterScreen();

    await userEvent
      .setup()
      .press(screen.getByRole("button", { name: "common.continue" }));

    await waitFor(() => expect(mockTriggerPatient).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("button", { name: "common.continue" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "common.back" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "common.register" }),
    ).toBeNull();
  });

  it("resets both forms and returns to the first step when switching roles", async () => {
    await renderRegisterScreen();
    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "common.continue" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "common.back" })).toBeTruthy(),
    );

    await user.press(
      screen.getByRole("button", { name: "auth.roles.professional" }),
    );

    expect(mockResetPatient).toHaveBeenCalledTimes(1);
    expect(mockResetProfessional).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "common.continue" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "common.back" })).toBeNull();
  });

  it("handles patient registration success at the screen", async () => {
    await renderRegisterScreen();
    await advanceToSubmit();

    await userEvent.setup().press(
      screen.getByRole("button", { name: "common.register" }),
    );

    expect(mockPatientMutate).toHaveBeenCalledWith(
      { ...patientFormData, role: "patient" },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );

    const callbacks = mockPatientMutate.mock.calls[0][1];
    await act(async () => callbacks.onSuccess());

    expect(screen.getByRole("button", { name: "common.continue" })).toBeTruthy();
    expect(Toast.show).toHaveBeenCalledWith({
      type: "success",
      text1: "auth.accountCreated",
      text2: "auth.checkEmailToConfirm",
    });
    expect(mockGoToLogin).toHaveBeenCalledTimes(1);
  });

  it("handles professional registration success at the screen", async () => {
    await renderRegisterScreen();
    await userEvent.setup().press(
      screen.getByRole("button", { name: "auth.roles.professional" }),
    );
    await advanceToSubmit();

    await userEvent.setup().press(
      screen.getByRole("button", { name: "common.register" }),
    );

    expect(mockProfessionalMutate).toHaveBeenCalledWith(
      professionalFormData,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );

    const callbacks = mockProfessionalMutate.mock.calls[0][1];
    await act(async () => callbacks.onSuccess());

    expect(screen.getByRole("button", { name: "common.continue" })).toBeTruthy();
    expect(Toast.show).toHaveBeenCalledWith({
      type: "success",
      text1: "auth.accountCreated",
      text2: "auth.checkEmailToConfirm",
    });
    expect(mockGoToLogin).toHaveBeenCalledTimes(1);
  });

  it("handles registration errors at the screen", async () => {
    const error = { title: "DuplicateEmail" };
    await renderRegisterScreen();
    await advanceToSubmit();

    await userEvent.setup().press(
      screen.getByRole("button", { name: "common.register" }),
    );
    const callbacks = mockPatientMutate.mock.calls[0][1];
    callbacks.onError(error);

    expect(mockHandleApiError).toHaveBeenCalledWith(error);
  });
});
