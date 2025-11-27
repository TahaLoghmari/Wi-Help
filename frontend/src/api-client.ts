import type { ProblemDetailsDto } from "@/types/enums.types";
import { env } from "@/config/env";
import { API_ENDPOINTS } from "@/config/endpoints";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    if (typeof body === "object") {
      body = JSON.stringify(body);
    }
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
    ...options,
    headers,
    credentials: "include",
    body,
  });

  if (
    response.status === 401 &&
    !endpoint.includes(API_ENDPOINTS.AUTH.REFRESH) &&
    !endpoint.includes(API_ENDPOINTS.AUTH.LOGIN) &&
    !isRefreshing
  ) {
    // Prevent multiple simultaneous refresh attempts
    if (!refreshPromise) {
      refreshPromise = fetch(`${env.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
        credentials: "include",
        method: "POST",
      }).then((res) => {
        refreshPromise = null;
        return res.ok;
      });
    }

    isRefreshing = true;
    const refreshSuccess = await refreshPromise;
    isRefreshing = false;

    if (refreshSuccess) {
      return request(endpoint, options);
    }
  }

  if (!response.ok) {
    const problemDetails: ProblemDetailsDto = await response.json();
    throw problemDetails;
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
  post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "POST", body });
  },
  put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "PUT", body });
  },
  patch<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "PATCH", body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "DELETE" });
  },
};
