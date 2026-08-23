import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { api } from "./api-client";
import { server } from "./test/server";

describe("api", () => {
  it("sends JSON requests and returns the API response", async () => {
    server.use(
      http.post("http://localhost:5000/auth/login", async ({ request }) => {
        expect(await request.json()).toEqual({
          email: "patient@example.com",
          password: "Password1!",
        });

        return HttpResponse.json({ accessToken: "access-token" });
      }),
    );

    const response = await api.post<{ accessToken: string }>("/auth/login", {
      email: "patient@example.com",
      password: "Password1!",
    });

    expect(response).toEqual({ accessToken: "access-token" });
  });
});
