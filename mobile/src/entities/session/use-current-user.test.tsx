import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { api } from "@/lib/api-client";
import { useCurrentUser } from "./use-current-user";

jest.mock("@/lib/api-client", () => ({
  api: { get: jest.fn() },
}));

describe("useCurrentUser", () => {
  const createUser = (role: string) => ({
    id: "user-1",
    firstName: "Ada",
    lastName: "Lovelace",
    dateOfBirth: "10/12/1815",
    gender: "female",
    phoneNumber: "+15551234567",
    email: "ada@example.com",
    address: {
      street: "1 Example Street",
      city: "London",
      postalCode: "SW1A 1AA",
      countryId: "gb",
      stateId: "london",
    },
    profilePictureUrl: "",
    role,
    isOnboardingCompleted: true,
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: Infinity, retry: false } },
    });

    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
    };
  };

  it.each([
    ["patient", "Patient"],
    ["PROFESSIONAL", "Professional"],
    ["AdMiN", "Admin"],
  ])("normalizes the %s API role", async (apiRole, expectedRole) => {
    const user = createUser(apiRole);
    jest.mocked(api.get).mockResolvedValue(user);

    const { result } = await renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.data).toEqual({ ...user, role: expectedRole }),
    );
    expect(api.get).toHaveBeenCalledWith("/auth/me");
  });

  it("maps an unknown API role to a safe sentinel", async () => {
    const user = createUser("super-user");
    jest.mocked(api.get).mockResolvedValue(user);

    const { result } = await renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.data).toEqual({ ...user, role: "Unknown" }),
    );
  });
});
