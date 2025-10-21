import type { ProblemDetailsDto } from "@/types/api.types";
import { env } from "@/config/env";

let isRefreshing = false;

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    if (options.method === "PATCH") {
      headers["Content-Type"] = "application/json-patch+json";
    } else {
      headers["Content-Type"] = "application/json";
    }
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${env.apiUrl}${endpoint}`, {
    headers,
    credentials: "include",
    ...options,
  });

  if (
    response.status === 401 &&
    !endpoint.includes("/auth/refresh") &&
    !endpoint.includes("/auth/login") &&
    !isRefreshing
  ) {
    try {
      isRefreshing = true;
      const refreshResponse = await fetch(`${env.apiUrl}/auth/refresh`, {
        credentials: "include",
        method: "POST",
      });

      if (refreshResponse.ok) {
        isRefreshing = false;
        return request(endpoint, options);
      } else {
        isRefreshing = false;
        let problemDetails: ProblemDetailsDto = await response.json();
        throw problemDetails;
      }
    } catch (error) {
      isRefreshing = false;
      let problemDetails: ProblemDetailsDto = await response.json();
      throw problemDetails;
    }
  }

  if (!response.ok) {
    let problemDetails: ProblemDetailsDto = await response.json();
    throw problemDetails;
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}
