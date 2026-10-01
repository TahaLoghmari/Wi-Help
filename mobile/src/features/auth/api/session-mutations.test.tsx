import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { sessionKeys } from "@/features/auth/session";
import { api } from "@/shared/api/api-client";
import { session } from "@/shared/api/session";
import { useLogin } from "./login";
import { useLogout } from "./logout";

jest.mock("@/shared/api/api-client", () => ({
  api: { post: jest.fn() },
}));

jest.mock("@/shared/api/session", () => ({
  session: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setTokens: jest.fn(),
    clear: jest.fn(),
    refresh: jest.fn(),
  },
}));

function createHarness() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { gcTime: 0 },
      mutations: { gcTime: 0, retry: false },
    },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

describe("authentication session mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(session.getRefreshToken).mockResolvedValue("refresh-token");
    jest.mocked(session.setTokens).mockResolvedValue(undefined);
    jest.mocked(session.clear).mockResolvedValue(undefined);
  });

  it("stores a successful login through the session interface", async () => {
    jest.mocked(api.post).mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    const { queryClient, wrapper } = createHarness();
    const invalidate = jest.spyOn(queryClient, "invalidateQueries");
    const { result } = await renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        email: "ada@example.com",
        password: "Password1!",
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(session.setTokens).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: sessionKeys.currentUser,
    });
  });

  it("clears session and cached application state after logout succeeds", async () => {
    jest.mocked(api.post).mockResolvedValue(undefined);
    const { queryClient, wrapper } = createHarness();
    queryClient.setQueryData(["private"], "cached");
    const { result } = await renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync();
    });
    await waitFor(() => expect(session.clear).toHaveBeenCalledTimes(1));

    expect(api.post).toHaveBeenCalledWith("/auth/logout", {
      refreshToken: "refresh-token",
    });
    expect(session.clear).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(["private"])).toBeUndefined();
  });

  it("clears session and cached application state when logout fails", async () => {
    jest.mocked(api.post).mockRejectedValue(new Error("network unavailable"));
    const { queryClient, wrapper } = createHarness();
    queryClient.setQueryData(["private"], "cached");
    const { result } = await renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow(
        "network unavailable",
      );
    });
    await waitFor(() => expect(session.clear).toHaveBeenCalledTimes(1));

    expect(session.clear).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(["private"])).toBeUndefined();
  });
});
