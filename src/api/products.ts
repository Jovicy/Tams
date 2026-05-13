import { ApiError, apiClient } from "../lib/api";

export type ProductPlan = "full" | "installment" | "thrift";

export interface ProductListFilters {
  categoryId?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  weight: string;
  karat: string;
  plans: ProductPlan[];
  installmentDurations: Array<3 | 6>;
  isActive: boolean;
  isFeatured: boolean;
  file: File;
}

export interface ApiProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: number;
  weight: string;
  karat: string;
  imageUrl: string;
  plans: string[];
  installmentDurations: Array<3 | 6 | number>;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ApiProductCategory;
}

export interface CreateProductResponse {
  status: boolean;
  message: string;
  data: ApiProduct;
}

export interface UpdateProductPayload {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  weight: string;
  karat: string;
  plans: ProductPlan[];
  installmentDurations: Array<3 | 6>;
  isActive: boolean;
  isFeatured: boolean;
  file?: File;
}

export interface UpdateProductResponse {
  status: boolean;
  message: string;
  data: ApiProduct;
}

export interface DeleteProductResponse {
  status: boolean;
  message: string;
  data?: null;
}

export interface GetProductResponse {
  status: boolean;
  message: string;
  data: ApiProduct;
}

export interface ListProductsResponse {
  status: boolean;
  message: string;
  data: {
    products?: ApiProduct[];
    items?: ApiProduct[];
    pagination?: {
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

function appendProductFormData(formData: FormData, payload: CreateProductPayload | UpdateProductPayload) {
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("categoryId", String(payload.categoryId));
  formData.append("weight", payload.weight);
  formData.append("karat", payload.karat);
  formData.append("plans", JSON.stringify(payload.plans));
  formData.append("installmentDurations", JSON.stringify(payload.installmentDurations));
  formData.append("isActive", String(payload.isActive));
  formData.append("isFeatured", String(payload.isFeatured));

  if (payload.file) {
    formData.append("file", payload.file);
  }
}

export function createProduct(payload: CreateProductPayload) {
  const formData = new FormData();

  appendProductFormData(formData, payload);

  return apiClient.post<CreateProductResponse>("/products", formData);
}

export function updateProduct(id: number, payload: UpdateProductPayload) {
  const formData = new FormData();

  appendProductFormData(formData, payload);

  return apiClient.patch<UpdateProductResponse>(`/products/${id}`, formData);
}

export function deleteProduct(id: number) {
  return apiClient.delete<DeleteProductResponse>(`/products/${id}`);
}

export function listProducts(filters: ProductListFilters = {}) {
  const query = {
    ...(filters.categoryId !== undefined ? { categoryId: filters.categoryId } : {}),
    ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    ...(filters.isFeatured !== undefined ? { isFeatured: filters.isFeatured } : {}),
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.page !== undefined ? { page: filters.page } : {}),
    ...(filters.pageSize !== undefined ? { pageSize: filters.pageSize } : {}),
  };

  return apiClient.get<ListProductsResponse>("/products", { query }).catch((error) => {
    if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
      return apiClient.get<ListProductsResponse>("/api/products", { query });
    }

    throw error;
  });
}

export function getProductById(id: number) {
  return apiClient.get<GetProductResponse>(`/products/${id}`).catch((error) => {
    if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
      return apiClient.get<GetProductResponse>(`/api/products/${id}`);
    }

    throw error;
  });
}
