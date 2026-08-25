import { request } from "./api-client";
import { session } from "./session";

jest.mock("@/lib/session", () => ({
  session: {
    getAccessToken: jest.fn(async () => null),
    getRefreshToken: jest.fn(async () => null),
    setTokens: jest.fn(async () => undefined),
    clear: jest.fn(async () => undefined),
    refresh: jest.fn(async () => false),
  },
}));

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
