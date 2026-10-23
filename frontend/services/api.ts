import apiClient from "@/lib/axios";
import { Product, Category, Brand, Order } from "@/types/store";
import { INITIAL_PRODUCTS, CATEGORIES, BRANDS } from "@/data/sampleProducts";

export interface CreateProductInput {
  sku: string;
  name: string;
  description: string;
  price: number;
  quantityOnHand: number;
  active?: boolean;
  categoryId?: number;
  brandId?: number;
  images?: string[];
  featured?: boolean;
}

export const productsApi = {
  getAll: async (params?: { categoryId?: number; brandId?: number }): Promise<Product[]> => {
    try {
      const res = await apiClient.get<Product[]>("/api/products", { params });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((p) => {
          const sample = INITIAL_PRODUCTS.find((s) => s.sku === p.sku);
          return {
            ...p,
            price: Number(p.price),
            description: p.description || sample?.description || "",
            images: p.images && p.images.length > 0 ? p.images : (sample?.images || (p.primaryImage ? [p.primaryImage] : sample?.primaryImage ? [sample.primaryImage] : [])),
            primaryImage: p.primaryImage || sample?.primaryImage || (sample?.images?.[0] || ""),
            featured: p.featured ?? sample?.featured ?? false,
            specs: p.specs || sample?.specs,
            categoryName: p.categoryName || sample?.categoryName,
            brandName: p.brandName || sample?.brandName,
          };
        });
      }
      return INITIAL_PRODUCTS;
    } catch (err) {
      console.warn("Using fallback products data:", err);
      return INITIAL_PRODUCTS;
    }
  },

  getById: async (id: number): Promise<Product> => {
    try {
      const res = await apiClient.get<Product>(`/api/products/${id}`);
      return res.data;
    } catch {
      const fallback = INITIAL_PRODUCTS.find((p) => p.id === id);
      if (fallback) return fallback;
      throw new Error(`Product ${id} not found`);
    }
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    try {
      const res = await apiClient.post<Product>("/api/products", data);
      return res.data;
    } catch {
      // In offline/mock fallback, create local item
      const newProduct: Product = {
        id: Date.now(),
        sku: data.sku,
        name: data.name,
        description: data.description,
        price: data.price,
        quantityOnHand: data.quantityOnHand,
        active: data.active ?? true,
        categoryId: data.categoryId,
        brandId: data.brandId,
        images: data.images || [],
        primaryImage: data.images?.[0],
        featured: data.featured ?? false,
      };
      return newProduct;
    }
  },

  update: async (id: number, data: Partial<CreateProductInput>): Promise<Product> => {
    try {
      const res = await apiClient.put<Product>(`/api/products/${id}`, data);
      return res.data;
    } catch {
      const existing = INITIAL_PRODUCTS.find((p) => p.id === id);
      return {
        ...(existing || ({} as Product)),
        ...data,
        id,
      } as Product;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/products/${id}`);
    } catch {
      // Handled in client state
    }
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const res = await apiClient.get<Category[]>("/api/categories");
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((c) => {
          const sample = CATEGORIES.find(
            (sc) => sc.name.toLowerCase() === c.name.toLowerCase()
          );
          return {
            ...c,
            icon: c.icon || sample?.icon || "💻",
            banner: c.banner || sample?.banner,
            images: c.images || sample?.images,
          };
        });
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    try {
      const res = await apiClient.post<Category>("/api/categories", data);
      return res.data;
    } catch {
      return {
        id: Date.now(),
        name: data.name || "New Category",
        description: data.description || "",
        icon: data.icon || "💻",
      };
    }
  },

  update: async (id: number, data: Partial<Category>): Promise<Category> => {
    try {
      const res = await apiClient.put<Category>(`/api/categories/${id}`, data);
      return res.data;
    } catch {
      const existing = CATEGORIES.find((c) => c.id === id);
      return { ...(existing || {}), ...data, id } as Category;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/categories/${id}`);
    } catch {
      // Offline fallback
    }
  },
};

export const brandsApi = {
  getAll: async (): Promise<Brand[]> => {
    try {
      const res = await apiClient.get<Brand[]>("/api/brands");
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((b) => {
          const sample = BRANDS.find(
            (sb) => sb.name.toLowerCase() === b.name.toLowerCase()
          );
          return {
            ...b,
            logo: b.logo || sample?.logo,
            banner: b.banner || sample?.banner,
            website: b.website || sample?.website,
          };
        });
      }
      return BRANDS;
    } catch {
      return BRANDS;
    }
  },

  create: async (data: Partial<Brand>): Promise<Brand> => {
    try {
      const res = await apiClient.post<Brand>("/api/brands", data);
      return res.data;
    } catch {
      return {
        id: Date.now(),
        name: data.name || "New Brand",
        description: data.description || "",
      };
    }
  },

  update: async (id: number, data: Partial<Brand>): Promise<Brand> => {
    try {
      const res = await apiClient.put<Brand>(`/api/brands/${id}`, data);
      return res.data;
    } catch {
      const existing = BRANDS.find((b) => b.id === id);
      return { ...(existing || {}), ...data, id } as Brand;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/brands/${id}`);
    } catch {
      // Offline fallback
    }
  },
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await apiClient.get("/api/products", { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
};
