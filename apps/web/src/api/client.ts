import type { ApiErrorCode, ApiErrorResponse } from "@weyfarer/types";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(
    status: number,
    code: ApiErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions {
  request?: RequestInit;
  userId?: string;
  signal?: AbortSignal;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      ...options.request,
      headers: {
        "Content-Type": "application/json",
        ...(options.userId && { "X-User-Id": options.userId }),
        ...options.request?.headers,
      },
      signal: options.signal ?? options.request?.signal,
    });

    const body = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      const error = (body as Partial<ApiErrorResponse> | null)?.error;

      throw new ApiError(
        response.status,
        error?.code ?? "INTERNAL_ERROR",
        error?.message ?? `Request failed with status ${response.status}.`,
        error?.details,
      );
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(0, "INTERNAL_ERROR", "An unexpected error occurred.");
  }
}
