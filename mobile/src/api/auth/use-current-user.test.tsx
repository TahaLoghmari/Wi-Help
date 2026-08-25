import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { api } from "@/lib/api-client";
import { useCurrentUser } from "./use-current-user";

jest.mock("@/lib/api-client", () => ({
  api: { get: jest.fn() },
}));

describe("useCurrentUser", () => {
  it("returns the current user from the API", async () => {
    const user = {
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
      role: "patient",
      isOnboardingCompleted: true,
    };
    jest.mocked(api.get).mockResolvedValue(user);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: Infinity, retry: false } },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = await renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(user));
    expect(api.get).toHaveBeenCalledWith("/auth/me");
  });
});
