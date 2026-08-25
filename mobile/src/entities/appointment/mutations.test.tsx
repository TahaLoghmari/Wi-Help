import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { api } from "@/lib/api-client";
import { appointmentKeys, useRespondToAppointment } from ".";

jest.mock("@/lib/api-client", () => ({
  api: { post: jest.fn() },
}));

describe("appointment mutations", () => {
  it("responds to an appointment and invalidates its list and detail", async () => {
    jest.mocked(api.post).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { gcTime: 0, retry: false } },
    });
    const invalidate = jest.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = await renderHook(() => useRespondToAppointment(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        appointmentId: "appointment-1",
        isAccepted: true,
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/appointments/appointment-1/respond", {
      isAccepted: true,
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: appointmentKeys.lists(),
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: appointmentKeys.detail("appointment-1"),
    });
  });
});
