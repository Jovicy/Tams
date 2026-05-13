import { apiClient } from "../lib/api";

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN" | string;
  isEmailVerified: boolean;
  isKycVerified: boolean;
  isSubmittedKYC: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListUsersParams {
  skip?: number;
  take?: number;
}

export interface ListUsersResponse {
  status: boolean;
  message: string;
  data: {
    users?: User[];
    items?: User[];
    pagination: {
      total?: number;
      totalItems?: number;
      skip: number;
      take: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export async function listUsers(params: ListUsersParams = {}) {
  const query = {
    ...(params.skip !== undefined ? { skip: params.skip } : {}),
    ...(params.take !== undefined ? { take: params.take } : {}),
  };

  return await apiClient.get<ListUsersResponse>("/users", { query });
}

export async function listAdminUsers(params: ListUsersParams = {}) {
  const query = {
    ...(params.skip !== undefined ? { skip: params.skip } : {}),
    ...(params.take !== undefined ? { take: params.take } : {}),
  };

  return await apiClient.get<ListUsersResponse>("/admin/users", { query });
}

export async function suspendAdminUser(id: number, isSuspended: boolean) {
  const body = { suspend: isSuspended };

  return await apiClient.patch(`/admin/users/${id}/suspend`, body);
}

export async function deleteAdminUser(id: number) {
  return await apiClient.delete(`/admin/users/${id}`);
}

export interface SubmitKycParams {
  documentType: string;
  file: File;
}

export interface SubmitKycResponse {
  status: boolean;
  message: string;
  data?: unknown;
}

export async function submitKyc(params: SubmitKycParams) {
  const formData = new FormData();
  // Only include required document fields
  formData.append("documentType", params.documentType);
  formData.append("file", params.file);

  return await apiClient.post<SubmitKycResponse>("/kyc", formData);
}

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface KycRecord {
  id: number;
  userId: number;
  documentType: string;
  documentUrl: string;
  status: KycStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewerId?: number;
  notes?: string;
}

export async function getKycRecord(id: number) {
  return await apiClient.get<{ status: boolean; message: string; data: KycRecord }>(`/kyc/${id}`);
}

export async function approveKyc(id: number, note?: string) {
  const body = note !== undefined ? { note } : undefined;
  return await apiClient.patch(`/kyc/${id}/approve`, body);
}

export async function rejectKyc(id: number, reason?: string, note?: string) {
  const body: Record<string, unknown> = {};
  if (reason !== undefined) body.reason = reason;
  if (note !== undefined) body.note = note;
  return await apiClient.patch(`/kyc/${id}/reject`, body);
}
