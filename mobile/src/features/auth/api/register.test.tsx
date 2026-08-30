import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import Toast from "react-native-toast-message";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { api } from "@/lib/api-client";
import { useRegisterPatient } from "./register-patient";
import { useRegisterProfessional } from "./register-professional";

jest.mock("@/lib/api-client", () => ({
  api: { post: jest.fn() },
}));

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

jest.mock("@/hooks/use-handle-api-error", () => ({
  useHandleApiError: jest.fn(() => jest.fn()),
}));

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(() => ({ t: (key: string) => key })),
}));

const patientPayload = {
  email: "ada@example.com",
  password: "Password1!",
  confirmPassword: "Password1!",
  firstName: "Ada",
  lastName: "Lovelace",
  dateOfBirth: "10/12/1815",
  gender: "Female",
  phoneNumber: "+15551234567",
  role: "patient",
};

const professionalPayload = {
  email: "grace@example.com",
  password: "Password1!",
  confirmPassword: "Password1!",
  firstName: "Grace",
  lastName: "Hopper",
  dateOfBirth: "09/12/1906",
  gender: "Female",
  phoneNumber: "+15557654321",
  specializationId: "specialization-1",
  experience: 10,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { gcTime: 0, retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("registration mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(api.post).mockResolvedValue(undefined);
  });

  it("posts the patient payload without performing UI orchestration", async () => {
    const { result } = await renderHook(() => useRegisterPatient(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(patientPayload);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith(
      "/patients/register",
      patientPayload,
    );
    expect(Toast.show).not.toHaveBeenCalled();
    expect(useHandleApiError).not.toHaveBeenCalled();
  });

  it("posts the professional payload without performing UI orchestration", async () => {
    const { result } = await renderHook(() => useRegisterProfessional(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(professionalPayload);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith(
      "/professionals/register",
      professionalPayload,
    );
    expect(Toast.show).not.toHaveBeenCalled();
    expect(useHandleApiError).not.toHaveBeenCalled();
  });
});
