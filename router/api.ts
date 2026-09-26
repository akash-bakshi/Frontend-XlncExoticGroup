// Backend API layer: transport, error handling and authentication.
// Same origin: Next.js proxies /api/* to the backend.
const BASE_URL = "";

export type Role = "admin" | "employee";

export interface Session {
  role: Role;
  username: string;
  company?: string | null;
  companies?: string[];
  first_name?: string | null;
  last_name?: string | null;
  tools?: string[];
  tool_links?: Record<string, string | null>;
  tool_names?: Record<string, string>;
}

interface LoginResult {
  correct: boolean;
  status: string;
  message: string;
  role: Role | null;
  retryAfter: number | null;
}

export class ApiError extends Error {
  status?: number;
  retryAfter: number | null;

  constructor(message: string, status?: number, retryAfter: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
}

interface ValidationIssue {
  loc?: (string | number)[];
  msg?: string;
}

export function request(path: string, { method = "GET", body }: RequestOptions = {}): Promise<Response> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const init: RequestInit = { method, credentials: "include", headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  return fetch(BASE_URL + path, init);
}

export function retryAfterOf(response: Response): number | null {
  const wait = parseInt(response.headers.get("Retry-After") ?? "", 10);
  return Number.isNaN(wait) ? null : wait;
}

function fallbackText(response: Response): string {
  return `Request failed (${response.status})`;
}

export async function errorText(response: Response): Promise<string> {
  try {
    const detail = (await response.json())?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return (detail as ValidationIssue[])
        .map((d) => {
          const field = (d.loc ?? []).slice(1).join(".");
          return (field ? `${field}: ` : "") + (d.msg || "invalid");
        })
        .join("; ");
    }
  } catch {
    // Non-JSON error body.
  }
  return fallbackText(response);
}

export async function json<T>(response: Response): Promise<T> {
  if (response.status === 204) return null as T;
  if (!response.ok) throw new ApiError(await errorText(response), response.status);
  return response.json() as Promise<T>;
}

export function unreachable(): never {
  throw new ApiError(
    `Could not reach the server at ${BASE_URL}. Check the backend is ` +
      "running and that this page's address is allowed by it."
  );
}

export async function send<T>(path: string, options?: RequestOptions): Promise<T> {
  let response: Response;
  try {
    response = await request(path, options);
  } catch {
    unreachable();
  }
  return json<T>(response);
}

export async function login(
  username: string,
  password: string,
  company: string | null,
  role: Role | null
): Promise<LoginResult> {
  let response: Response;
  try {
    response = await request("/api/auth/login", {
      method: "POST",
      body: { username, password, company: company || null, role: role || null },
    });
  } catch {
    unreachable();
  }

  if (response.status === 422) {
    throw new ApiError("Username and password are both required.", 422);
  }

  let data: { status?: string; message?: string; role?: Role };
  try {
    data = await response.json();
  } catch {
    throw new ApiError(fallbackText(response), response.status);
  }

  return {
    correct: data.status === "Correct",
    status: data.status || "",
    message: data.message || data.status || "",
    role: data.role || null,
    retryAfter: retryAfterOf(response),
  };
}

export async function me(): Promise<Session | null> {
  try {
    const response = await request("/api/auth/me");
    return response.ok ? ((await response.json()) as Session) : null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<boolean> {
  try {
    await request("/api/auth/logout", { method: "POST" });
    return true;
  } catch {
    return false;
  }
}
