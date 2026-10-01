import { createApiClient, request } from "./api-client";
import type { Session } from "./session";
import { session } from "./session";

jest.mock("@/shared/api/session", () => ({
  session: {
    getAccessToken: jest.fn(async () => null),
    getRefreshToken: jest.fn(async () => null),
    setTokens: jest.fn(async () => undefined),
    clear: jest.fn(async () => undefined),
    refresh: jest.fn(async () => false),
  },
}));

function createSessionStub(overrides: Partial<Session> = {}): Session {
  return {
    getAccessToken: jest.fn(async () => null),
    getRefreshToken: jest.fn(async () => null),
    setTokens: jest.fn(async () => undefined),
    clear: jest.fn(async () => undefined),
    refresh: jest.fn(async () => false),
    ...overrides,
  };
}

describe("createApiClient", () => {
  it("uses the injected base URL, fetch implementation, and session", async () => {
    const injectedSession = createSessionStub({
      getAccessToken: jest.fn(async () => "access-token"),
    });
    const fetchImpl = jest.fn(async () =>
      Promise.resolve(new Response(JSON.stringify({ id: "user-1" }))),
    );
    const client = createApiClient({
      baseUrl: "https://api.example.test",
      fetchImpl,
      session: injectedSession,
    });

    await expect(
      client.api.post("/users", { name: "Taha" }, { headers: { "X-Test": "yes" } }),
    ).resolves.toEqual({ id: "user-1" });

    expect(fetchImpl).toHaveBeenCalledWith("https://api.example.test/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Test": "yes",
        Authorization: "Bearer access-token",
      },
      body: JSON.stringify({ name: "Taha" }),
    });
  });

  it("passes multipart bodies through without a JSON content type", async () => {
    const fetchImpl = jest.fn(async () => new Response(null, { status: 204 }));
    const client = createApiClient({
      baseUrl: "https://api.example.test",
      fetchImpl,
      session: createSessionStub(),
    });
    const body = new FormData();
    body.append("title", "Care plan");

    await client.api.post("/appointments/appointment-1/complete", body);

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.example.test/appointments/appointment-1/complete",
      {
        method: "POST",
        headers: {},
        body,
      },
    );
  });

  it("returns an empty object for an empty successful response", async () => {
    const client = createApiClient({
      baseUrl: "https://api.example.test",
      fetchImpl: jest.fn(async () => new Response(null, { status: 204 })),
      session: createSessionStub(),
    });

    await expect(client.request("/users/user-1")).resolves.toEqual({});
  });

  it("preserves structured API errors", async () => {
    const client = createApiClient({
      baseUrl: "https://api.example.test",
      fetchImpl: jest.fn(async () =>
        new Response(JSON.stringify({ title: "Unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/problem+json" },
        }),
      ),
      session: createSessionStub(),
    });

    await expect(client.request("/auth/me")).rejects.toMatchObject({
      status: 401,
      title: "Unauthorized",
    });
  });

  it("refreshes and retries an unauthorized request at most once", async () => {
    const injectedSession = createSessionStub({
      refresh: jest.fn(async () => true),
    });
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response("Unauthorized", { status: 401 }));
    const client = createApiClient({
      baseUrl: "https://api.example.test",
      fetchImpl,
      session: injectedSession,
    });

    await expect(client.request("/auth/me")).rejects.toMatchObject({
      status: 401,
    });

    expect(injectedSession.refresh).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});

describe("request", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(session.getAccessToken).mockResolvedValue(null);
    jest.mocked(session.refresh).mockResolvedValue(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("preserves the HTTP status when a problem response omits it", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ title: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/problem+json" },
      }),
    );

    await expect(request("/auth/me")).rejects.toMatchObject({
      status: 401,
      title: "Unauthorized",
    });
  });

  it("preserves the HTTP status for a non-JSON error response", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response("Unauthorized", {
        status: 401,
        headers: { "content-type": "text/plain" },
      }),
    );

    await expect(request("/auth/me")).rejects.toMatchObject({ status: 401 });
  });

  it("refreshes once and retries an unauthorized request with the new token", async () => {
    jest
      .mocked(session.getAccessToken)
      .mockResolvedValueOnce("expired-token")
      .mockResolvedValueOnce("new-token");
    jest.mocked(session.refresh).mockResolvedValue(true);
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "user-1" }), { status: 200 }),
      );

    await expect(request<{ id: string }>("/auth/me")).resolves.toEqual({
      id: "user-1",
    });

    expect(session.refresh).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer new-token",
        }),
      }),
    );
  });

  it("allows a later request to refresh after an earlier refresh failed", async () => {
    jest
      .mocked(session.refresh)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true })));

    await expect(request("/first")).rejects.toMatchObject({ status: 401 });
    await expect(request("/second")).resolves.toEqual({ ok: true });

    expect(session.refresh).toHaveBeenCalledTimes(2);
  });
});
