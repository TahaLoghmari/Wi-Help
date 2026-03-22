import type { ProblemDetailsDto } from "@/types/enums.types";
import { env } from "@/config/env";
import { API_ENDPOINTS } from "@/config/endpoints";
import { tokenStorage } from "@/lib/tokenStorage";

let refreshPromise: Promise<boolean> | null = null;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0,
): Promise<T> {
  const headers: Record<string, string> = {};

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    if (typeof body === "object") {
      body = JSON.stringify(body);
    }
    headers["Content-Type"] = "application/json";
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${env.apiUrl}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  if (
    response.status === 401 &&
    !endpoint.includes(API_ENDPOINTS.AUTH.REFRESH) &&
    !endpoint.includes(API_ENDPOINTS.AUTH.LOGIN) &&
    refreshAttempts < MAX_REFRESH_ATTEMPTS &&
    retryCount === 0
  ) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          refreshAttempts++;
          return false;
        }

        try {
          const res = await fetch(
            `${env.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            },
          );

          if (res.ok) {
            const data = (await res.json()) as {
              accessToken: string;
              refreshToken: string;
            };
            await tokenStorage.setTokens(data.accessToken, data.refreshToken);
            refreshAttempts = 0;
            return true;
          } else {
            refreshAttempts++;
            await tokenStorage.clearTokens();
            return false;
          }
        } catch {
          refreshAttempts++;
          await tokenStorage.clearTokens();
          return false;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const refreshSuccess = await refreshPromise;

    if (refreshSuccess) {
      return request(endpoint, options, retryCount + 1);
    }
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (
      contentType &&
      (contentType.includes("application/json") ||
        contentType.includes("application/problem+json"))
    ) {
      let problemDetails: ProblemDetailsDto;
      try {
        problemDetails = await response.json();
      } catch {
        throw new Error(`Request failed with status ${response.status}`);
      }
      throw problemDetails;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

type RequestOptions = Omit<RequestInit, "method" | "body">;

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "GET" });
  },
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, {
      ...options,
      method: "POST",
      body: body as BodyInit,
    });
  },
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, {
      ...options,
      method: "PUT",
      body: body as BodyInit,
    });
  },
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, {
      ...options,
      method: "PATCH",
      body: body as BodyInit,
    });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "DELETE" });
  },
};
