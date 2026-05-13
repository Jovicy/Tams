import { apiClient } from "../lib/api";

export interface AdminDashboardData {
  activeCustomers: number;
  pendingKyc: number;
  suspendedAccounts: number;
}

export interface AdminDashboardResponse {
  status: boolean;
  message: string;
  data: AdminDashboardData;
}

export async function getAdminDashboard() {
  return await apiClient.get<AdminDashboardResponse>("/dashboard/admin");
}

export interface RecentOrderProduct {
  name: string;
  price: number;
}

export interface RecentOrder {
  id: number;
  orderId: string;
  customerId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  whatsappMessageSent: boolean;
  createdAt: string;
  updatedAt: string;
  product?: RecentOrderProduct;
}

export interface UserDashboardData {
  totalOrders: number;
  pendingOrders: number;
  totalCommitted: number;
  recentOrders: RecentOrder[];
}

export interface UserDashboardResponse {
  status: boolean;
  message: string;
  data: UserDashboardData;
}

let userDashboardRequestPromise: Promise<UserDashboardResponse> | null = null;

export async function getUserDashboard() {
  if (userDashboardRequestPromise) {
    return userDashboardRequestPromise;
  }

  userDashboardRequestPromise = apiClient.get<UserDashboardResponse>("/dashboard/me").finally(() => {
    userDashboardRequestPromise = null;
  });

  return userDashboardRequestPromise;
}
