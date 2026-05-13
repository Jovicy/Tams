export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiQueryValue = string | number | boolean | null | undefined | Array<string | number | boolean>;
export type ApiQueryParams = Record<string, ApiQueryValue>;

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "method"> {
  method?: ApiMethod;
  body?: unknown;
  query?: ApiQueryParams;
  baseUrl?: string;
  skipAuthRefresh?: boolean;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const DEFAULT_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").toString().trim().replace(/\/$/, "");
const AUTH_SESSION_STORAGE_KEY = "tams_auth_session";
const AUTH_UPDATED_EVENT = "tams-auth-updated";

interface StoredAuthSession {
  user?: unknown;
  accessToken?: string;
  refreshToken?: string;
}

interface RefreshResponseData {
  accessToken?: string;
  refreshToken?: string;
  user?: unknown;
}

function readStoredSession(): StoredAuthSession | null {
  if (typeof window === "undefined") return null;

  const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession) as StoredAuthSession;
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredAuthSession | null) {
  if (typeof window === "undefined") return;

  if (session) {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    window.localStorage.setItem("tams_customer_logged_in", "true");
  } else {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    window.localStorage.removeItem("tams_customer_logged_in");
  }

  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

function getStoredAccessToken() {
  if (typeof window === "undefined") return null;

  const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!storedSession) return null;

  try {
    const parsed = JSON.parse(storedSession) as { accessToken?: string };
    return parsed.accessToken ?? null;
  } catch {
    return null;
  }
}

function getStoredRefreshToken() {
  const storedSession = readStoredSession();
  return storedSession?.refreshToken ?? null;
}

async function refreshAuthSession() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return false;

  const refreshUrl = buildUrl("/auth/refresh");
  const response = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = (await parseResponseBody<{ status: boolean; message: string; data: RefreshResponseData }>(response)) ?? null;

  if (!response.ok) {
    writeStoredSession(null);
    return false;
  }

  const currentSession = readStoredSession();
  if (!currentSession) return true;

  const refreshedData = payload?.data ?? {};
  writeStoredSession({
    ...currentSession,
    ...refreshedData,
    user: refreshedData.user ?? currentSession.user,
    accessToken: refreshedData.accessToken ?? currentSession.accessToken,
    refreshToken: refreshedData.refreshToken ?? currentSession.refreshToken,
  });

  return true;
}

function appendQueryParams(url: URL, query?: ApiQueryParams) {
  if (!query) return;

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)));
      return;
    }

    url.searchParams.append(key, String(value));
  });
}

function buildUrl(path: string, query?: ApiQueryParams, baseUrl = DEFAULT_BASE_URL) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!baseUrl) {
    const url = new URL(normalizedPath, window.location.origin);
    appendQueryParams(url, query);
    return url.toString();
  }

  const url = new URL(`${baseUrl}${normalizedPath}`);
  appendQueryParams(url, query);
  return url.toString();
}

async function parseResponseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

async function apiRequestInternal<T>(path: string, options: ApiRequestOptions = {}, retryOn401 = true): Promise<T> {
  const { baseUrl, body, query, headers, method = "GET", skipAuthRefresh, ...rest } = options;
  const url = buildUrl(path, query, baseUrl);
  const requestHeaders = new Headers(headers);

  const accessToken = getStoredAccessToken();
  if (accessToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
      requestBody = body;
    } else {
      requestHeaders.set("Content-Type", "application/json");
      requestBody = JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    ...rest,
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  const payload = await parseResponseBody<T>(response);

  if (response.status === 401 && retryOn401 && !skipAuthRefresh) {
    const refreshed = await refreshAuthSession();
    if (refreshed) {
      return await apiRequestInternal<T>(path, options, false);
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload && typeof payload === "object" && "message" in payload
          ? String((payload as { message?: unknown }).message ?? `Request failed with status ${response.status}`)
          : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return await apiRequestInternal<T>(path, options, true);
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) => apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) => apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) => apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) => apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) => apiRequest<T>(path, { ...options, method: "DELETE" }),
};
