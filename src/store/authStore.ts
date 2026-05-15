import { useSyncExternalStore } from "react";
import { getCurrentUser, signInAdminUser, signInUser, signUpUser, type ApiAuthUser, type AuthRole, type LoginPayload, type SignUpPayload } from "../api/auth";

const AUTH_SESSION_STORAGE_KEY = "tams_auth_session";
const AUTH_STORAGE_KEY = "tams_customer_logged_in";
let authProfileRefreshPromise: Promise<AuthSession | null> | null = null;

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: AuthRole;
  isEmailVerified: boolean;
  emailVerificationOtpExpiresAt?: string | null;
  isKycVerified: boolean;
  isSubmittedKYC: boolean;
  isSuspended: boolean;
  kycDocType: string | null;
  kycDocNumber: string | null;
  kycDocUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

let state: AuthState = readAuthState();
const listeners = new Set<() => void>();

function normalizeRole(role: string): AuthRole {
  switch (role.toLowerCase()) {
    case "admin":
      return "admin";
    case "super_admin":
    case "super-admin":
      return "super_admin";
    default:
      return "customer";
  }
}

function normalizeUser(user: ApiAuthUser): AuthUser {
  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!storedSession) return null;

  try {
    const parsed = JSON.parse(storedSession) as AuthSession;
    if (!parsed?.user) return null;
    return {
      ...parsed,
      user: normalizeUser(parsed.user as ApiAuthUser),
    };
  } catch {
    return null;
  }
}

function readAuthState(): AuthState {
  const session = readStoredSession();
  const isAuthenticated = typeof window === "undefined" ? false : window.localStorage.getItem(AUTH_STORAGE_KEY) === "true" || Boolean(session);

  return {
    session,
    isAuthenticated,
    loading: false,
    error: null,
  };
}

function persistAuthState(nextState: AuthState) {
  if (typeof window === "undefined") return;

  if (nextState.session) {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(nextState.session));
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  } else if (!nextState.isAuthenticated) {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  }
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function updateAuthState(updater: (current: AuthState) => AuthState) {
  state = updater(state);
  persistAuthState(state);
  emitChange();
}

function syncFromStorage() {
  state = readAuthState();
  emitChange();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", syncFromStorage);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthState(): AuthState {
  return state;
}

export function useAuthStore(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => ({ session: null, isAuthenticated: false, loading: false, error: null }),
  );
}

export function setAuthSession(session: AuthSession | null) {
  updateAuthState((current) => ({
    ...current,
    session,
    isAuthenticated: Boolean(session),
    loading: false,
    error: null,
  }));
}

export function setAuthPresence(isAuthenticated: boolean) {
  updateAuthState((current) => ({
    ...current,
    session: isAuthenticated ? current.session : null,
    isAuthenticated,
    loading: false,
    error: null,
  }));
}

export function signOut() {
  setAuthSession(null);
}

export async function refreshAuthUserProfile(): Promise<AuthSession | null> {
  if (authProfileRefreshPromise) {
    return authProfileRefreshPromise;
  }

  authProfileRefreshPromise = (async () => {
    const currentSession = readStoredSession();
    if (!currentSession) return null;

    try {
      const response = await getCurrentUser();
      const currentUser = response.data;
      if (!currentUser) return null;

      const nextSession: AuthSession = {
        ...currentSession,
        user: {
          ...currentSession.user,
          ...normalizeUser(currentUser),
          role: currentSession.user.role,
        },
      };

      setAuthSession(nextSession);
      return nextSession;
    } catch {
      return null;
    } finally {
      authProfileRefreshPromise = null;
    }
  })();

  return authProfileRefreshPromise;
}

export async function signUp(payload: SignUpPayload) {
  updateAuthState((current) => ({
    ...current,
    loading: true,
    error: null,
  }));

  try {
    const response = await signUpUser(payload);
    const session: AuthSession = {
      user: normalizeUser(response.data.user),
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };

    setAuthSession(session);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign up.";

    updateAuthState((current) => ({
      ...current,
      loading: false,
      error: message,
    }));

    throw error;
  }
}

export async function signIn(payload: LoginPayload) {
  updateAuthState((current) => ({
    ...current,
    loading: true,
    error: null,
  }));

  try {
    const response = await signInUser(payload);
    const session: AuthSession = {
      user: normalizeUser(response.data.user),
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };

    setAuthSession(session);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";

    updateAuthState((current) => ({
      ...current,
      loading: false,
      error: message,
    }));

    throw error;
  }
}

export async function signInAdmin(payload: LoginPayload) {
  updateAuthState((current) => ({
    ...current,
    loading: true,
    error: null,
  }));

  try {
    const response = await signInAdminUser(payload);
    const session: AuthSession = {
      user: normalizeUser(response.data.user),
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };

    setAuthSession(session);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";

    updateAuthState((current) => ({
      ...current,
      loading: false,
      error: message,
    }));

    throw error;
  }
}
