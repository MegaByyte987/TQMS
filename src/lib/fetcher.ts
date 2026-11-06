import { env } from "./env";

export class ApiError extends Error {
  readonly status: number;
  readonly payload: ApiEnvelope<unknown> | null;

  constructor(status: number, payload: ApiEnvelope<unknown> | null, message?: string) {
    super(message ?? payload?.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }

  fieldErrors(): Record<string, string[]> {
    return this.payload?.errors ?? {};
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const url = path.startsWith("http")
    ? path
    : `${env.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (cause) {
    throw new ApiError(0, null, "Network error — check your connection.");
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? ((await res.json()) as ApiEnvelope<T>) : null;

  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }
  return payload as ApiEnvelope<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};