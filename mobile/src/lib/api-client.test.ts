import { request } from "./api-client";

jest.mock("@/lib/token-storage", () => ({
  tokenStorage: {
    getAccessToken: jest.fn(async () => null),
    getRefreshToken: jest.fn(async () => null),
    clearTokens: jest.fn(async () => undefined),
  },
}));

describe("request", () => {
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
});
