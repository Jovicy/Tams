import { apiClient } from "../lib/api";

export interface CreateOrderPayload {
  productId: number;
  quantity: number;
  paymentPlan: "Full" | "Installment" | "Thrift";
  installmentDuration?: 3 | 6;
}

export interface OrderResponse {
  id: string;
  productId: number;
  quantity: number;
  paymentPlan: string;
  installmentDuration?: number;
  status: string;
  createdAt: string;
}

export type OrderTrackingStatus = "PENDING" | "AWAITING_WHATSAPP" | "CONFIRMED" | "SHIPPED" | "COMPLETED" | "CANCELLED" | string;
export type OrderTrackingPaymentStatus = "pending" | "confirmed" | "refunded";

export interface MyOrder {
  id: number;
  orderId: string;
  customerId?: number;
  productId?: number;
  productName?: string;
  quantity: number;
  totalPrice: number;
  paymentPlan?: "Full" | "Installment" | "Thrift" | string;
  installmentDuration?: 3 | 6;
  status: string; // API may return uppercase values
  paymentStatus: string;
  whatsappMessageSent: boolean;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  customer?: {
    id: number;
    fullName: string;
    email?: string;
    phone?: string;
  };
  installments?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface GetMyOrdersResponse {
  status: boolean;
  message: string;
  data: {
    orders?: MyOrder[];
    items?: MyOrder[];
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  return await apiClient.post<OrderResponse>("/orders", payload);
}

export async function getMyOrders(): Promise<GetMyOrdersResponse> {
  return await apiClient.get<GetMyOrdersResponse>("/orders/my").catch((error) => {
    return apiClient.get<GetMyOrdersResponse>("/api/orders/my").catch(() => {
      throw error;
    });
  });
}

export interface GetOrdersResponse {
  status: boolean;
  message: string;
  data: {
    orders?: MyOrder[];
    items?: MyOrder[];
  };
}

export async function getOrders(): Promise<GetOrdersResponse> {
  return await apiClient.get<GetOrdersResponse>("/orders");
}

export interface UpdateOrderPayload {
  status?: string;
  paymentStatus?: string;
}

export async function updateOrderStatus(orderId: number, status: string): Promise<GetOrdersResponse> {
  const path = `/orders/${orderId}/status`;

  return await apiClient.patch<GetOrdersResponse>(path, { status });
}

export async function updateOrderPaymentStatus(orderId: number, paymentStatus: string): Promise<GetOrdersResponse> {
  const path = `/orders/${orderId}/payment-status`;

  return await apiClient.patch<GetOrdersResponse>(path, { paymentStatus });
}
