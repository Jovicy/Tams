import { apiClient } from "../lib/api";

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface CreateCategoryResponse {
  status: boolean;
  message: string;
  data: Category;
}

export interface UpdateCategoryPayload {
  name: string;
}

export interface UpdateCategoryResponse {
  status: boolean;
  message: string;
  data: Category;
}

export interface DeleteCategoryResponse {
  status: boolean;
  message: string;
  data?: null;
}

export interface ListCategoriesResponse {
  status: boolean;
  message: string;
  data: {
    categories?: Category[];
    items?: Category[];
    pagination: {
      skip: number;
      take: number;
      page: number;
      pageSize: number;
      total?: number;
      totalItems?: number;
      totalPages: number;
      hasMore?: boolean;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  };
}

export interface ListCategoriesParams {
  skip?: number;
  take?: number;
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient.post<CreateCategoryResponse>("/categories", payload);
}

export function updateCategory(id: number, payload: UpdateCategoryPayload) {
  return apiClient.patch<UpdateCategoryResponse>(`/categories/${id}`, payload);
}

export function deleteCategory(id: number) {
  return apiClient.delete<DeleteCategoryResponse>(`/categories/${id}`);
}

export function listCategories(params: ListCategoriesParams = {}) {
  return apiClient.get<ListCategoriesResponse>("/categories", {
    query: {
      ...(params.skip !== undefined ? { skip: params.skip } : {}),
      ...(params.take !== undefined ? { take: params.take } : {}),
    },
  });
}
