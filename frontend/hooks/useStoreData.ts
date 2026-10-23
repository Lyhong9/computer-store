"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsApi,
  categoriesApi,
  brandsApi,
  checkBackendHealth,
  CreateProductInput,
} from "@/services/api";
import { Product, Category, Brand } from "@/types/store";

export const QUERY_KEYS = {
  products: ["products"] as const,
  product: (id: number) => ["products", id] as const,
  categories: ["categories"] as const,
  brands: ["brands"] as const,
  backendHealth: ["backend-health"] as const,
};

// 1. Products Hooks
export function useProducts(params?: { categoryId?: number; brandId?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, params],
    queryFn: () => productsApi.getAll(params),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProd: CreateProductInput) => productsApi.create(newProd),
    onSuccess: (created) => {
      queryClient.setQueryData<Product[]>(QUERY_KEYS.products, (old) => {
        if (!old) return [created];
        return [created, ...old];
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateProductInput> }) =>
      productsApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Product[]>(QUERY_KEYS.products, (old) => {
        if (!old) return [updated];
        return old.map((p) => (p.id === updated.id ? { ...p, ...updated } : p));
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Product[]>(QUERY_KEYS.products, (old) => {
        if (!old) return [];
        return old.filter((p) => p.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}

// 2. Categories Hooks
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => categoriesApi.getAll(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cat: Partial<Category>) => categoriesApi.create(cat),
    onSuccess: (created) => {
      queryClient.setQueryData<Category[]>(QUERY_KEYS.categories, (old) => {
        if (!old) return [created];
        return [...old, created];
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}

// 3. Brands Hooks
export function useBrands() {
  return useQuery({
    queryKey: QUERY_KEYS.brands,
    queryFn: () => brandsApi.getAll(),
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brand: Partial<Brand>) => brandsApi.create(brand),
    onSuccess: (created) => {
      queryClient.setQueryData<Brand[]>(QUERY_KEYS.brands, (old) => {
        if (!old) return [created];
        return [...old, created];
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Brand> }) =>
      brandsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => brandsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands });
    },
  });
}

// 4. Backend Health Hook
export function useBackendHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.backendHealth,
    queryFn: checkBackendHealth,
    refetchInterval: 10000, // Re-check every 10 seconds
  });
}
