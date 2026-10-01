import { createSession, type SessionStorage } from "./session";

function createStorage(): jest.Mocked<SessionStorage> {
  return {
    getAccessToken: jest.fn(async () => null),
    getRefreshToken: jest.fn(async () => "refresh-token"),
    setTokens: jest.fn<Promise<void>, [string, string]>(
      async () => undefined,
    ),
    clearTokens: jest.fn(async () => undefined),
  };
}

function successfulRefresh(
  accessToken = "new-access-token",
  refreshToken = "new-refresh-token",
) {
  return new Response(JSON.stringify({ accessToken, refreshToken }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

describe("Session", () => {
  it("shares one token refresh between concurrent callers", async () => {
    const storage = createStorage();
    const fetchImpl = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(successfulRefresh());
    const session = createSession({
      apiUrl: "https://api.example.com",
      fetchImpl,
      storage,
    });

    await expect(
      Promise.all([session.refresh(), session.refresh()]),
    ).resolves.toEqual([true, true]);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.example.com/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: "refresh-token" }),
      },
    );
    expect(storage.setTokens).toHaveBeenCalledWith(
      "new-access-token",
      "new-refresh-token",
    );
  });

  it("allows a later refresh after a failed attempt", async () => {
    const storage = createStorage();
    const fetchImpl = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(successfulRefresh());
    const session = createSession({
      apiUrl: "https://api.example.com",
      fetchImpl,
      storage,
    });

    await expect(session.refresh()).resolves.toBe(false);
    await expect(session.refresh()).resolves.toBe(true);

    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("does not restore tokens when logout wins a refresh race", async () => {
    const storage = createStorage();
    let resolveRefresh!: (response: Response) => void;
    const fetchImpl = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockReturnValue(
        new Promise<Response>((resolve) => {
          resolveRefresh = resolve;
        }),
      );
    const session = createSession({
      apiUrl: "https://api.example.com",
      fetchImpl,
      storage,
    });

    const refresh = session.refresh();
    await Promise.resolve();
    await session.clear();
    resolveRefresh(successfulRefresh());

    await expect(refresh).resolves.toBe(false);
    expect(storage.clearTokens).toHaveBeenCalledTimes(1);
    expect(storage.setTokens).not.toHaveBeenCalled();
  });

  it("does not overwrite a newer login with an older refresh", async () => {
    const storage = createStorage();
    let resolveRefresh!: (response: Response) => void;
    const fetchImpl = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockReturnValue(
        new Promise<Response>((resolve) => {
          resolveRefresh = resolve;
        }),
      );
    const session = createSession({
      apiUrl: "https://api.example.com",
      fetchImpl,
      storage,
    });

    const refresh = session.refresh();
    await Promise.resolve();
    await session.setTokens({
      accessToken: "login-access-token",
      refreshToken: "login-refresh-token",
    });
    resolveRefresh(successfulRefresh("stale-access", "stale-refresh"));

    await expect(refresh).resolves.toBe(false);
    expect(storage.setTokens).toHaveBeenCalledTimes(1);
    expect(storage.setTokens).toHaveBeenCalledWith(
      "login-access-token",
      "login-refresh-token",
    );
  });
});
