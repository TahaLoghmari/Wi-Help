import type { ProblemDetailsDto } from "@/types/enums.types";
import { env } from "@/config/env";
import { API_ENDPOINTS } from "@/config/endpoints";
import { session } from "@/lib/session";

function createHttpError(status: number) {
  return Object.assign(new Error(`Request failed with status ${status}`), {
    status,
  });
}

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

  const accessToken = await session.getAccessToken();
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
    retryCount === 0
  ) {
    const refreshSuccess = await session.refresh();

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
        throw createHttpError(response.status);
      }
      problemDetails.status ??= response.status;
      throw problemDetails;
    } else {
      throw createHttpError(response.status);
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
