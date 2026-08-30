import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { useGetCurrentPatient } from "./patient";
import { useGetCurrentProfessional } from "./professional";

jest.mock("@/lib/api-client", () => ({
  api: { get: jest.fn() },
}));

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

describe("current profile queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["patient", useGetCurrentPatient],
    ["professional", useGetCurrentProfessional],
  ])("does not request the current %s when disabled", async (_profile, useProfile) => {
    const { result } = await renderHook(() => useProfile({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(api.get).not.toHaveBeenCalled();
  });

  it.each([
    ["patient", useGetCurrentPatient, API_ENDPOINTS.PATIENTS.CURRENT_PATIENT],
    [
      "professional",
      useGetCurrentProfessional,
      API_ENDPOINTS.PROFESSIONALS.CURRENT_PROFESSIONAL,
    ],
  ])(
    "requests the current %s by default",
    async (_profile, useProfile, endpoint) => {
      jest.mocked(api.get).mockResolvedValue({ id: "profile-1" });

      const { result } = await renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(api.get).toHaveBeenCalledWith(endpoint);
    },
  );
});
