import { apiClient } from "../lib/api";

export type AuthRole = "customer" | "admin" | "super_admin";

export interface ApiAuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
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

export interface SignUpPayload {
  email: string;
  fullName: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  otp?: string;
}

export interface SignUpResponse {
  status: boolean;
  message: string;
  data: {
    user: ApiAuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: ApiAuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyEmailResponse {
  status: boolean;
  message: string;
  data: {
    email: string;
    expiresAt: string;
    expiresInMinutes: number;
  };
}

export function signUpUser(payload: SignUpPayload) {
  return apiClient.post<SignUpResponse>("/auth/signup", payload);
}

export function signInUser(payload: LoginPayload) {
  return apiClient.post<LoginResponse>("/auth/login", payload);
}

export function signInAdminUser(payload: LoginPayload) {
  return apiClient.post<LoginResponse>("/auth/admin/login", payload);
}

export function getCurrentUser() {
  return apiClient.get<{ status: boolean; message: string; data: ApiAuthUser }>("/auth/me");
}

export function requestEmailVerification() {
  return apiClient.post<VerifyEmailResponse>("/users/me/email-verification/request");
}

export function verifyEmailOtp(payload: VerifyEmailPayload) {
  return apiClient.post<VerifyEmailResponse>("/users/me/email-verification/verify", payload);
}
