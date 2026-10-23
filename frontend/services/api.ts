import apiClient from "@/lib/axios";
import { Product, Category, Brand, Order } from "@/types/store";
import { INITIAL_PRODUCTS, CATEGORIES, BRANDS } from "@/data/sampleProducts";

export interface CreateProductInput {
  sku: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantityOnHand: number;
  active?: boolean;
  categoryId?: number;
  brandId?: number;
  images?: string[];
  primaryImage?: string;
  featured?: boolean;
  badge?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  size?: number;
}

export const productsApi = {
  getAll: async (params?: ProductQueryParams): Promise<Product[]> => {
    try {
      const res = await apiClient.get<any>("/api/products", { params });
      const rawData = Array.isArray(res.data) ? res.data : (res.data?.content || []);

      if (Array.isArray(rawData) && rawData.length > 0) {
        return rawData.map((p: any) => {
          const sample = INITIAL_PRODUCTS.find((s) => s.sku === p.sku);
          return {
            ...p,
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : sample?.originalPrice,
            description: p.description || sample?.description || "",
            images:
              p.images && p.images.length > 0
                ? p.images
                : sample?.images || (p.primaryImage ? [p.primaryImage] : []),
            primaryImage: p.primaryImage || sample?.primaryImage || p.images?.[0] || "",
            featured: p.featured ?? sample?.featured ?? false,
            badge: p.badge || sample?.badge,
            rating: p.rating ? Number(p.rating) : sample?.rating || 5.0,
            reviewCount: p.reviewCount ?? sample?.reviewCount ?? 0,
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
      const newProduct: Product = {
        id: Date.now(),
        sku: data.sku,
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        quantityOnHand: data.quantityOnHand,
        active: data.active ?? true,
        categoryId: data.categoryId,
        brandId: data.brandId,
        images: data.images || [],
        primaryImage: data.primaryImage || data.images?.[0],
        featured: data.featured ?? false,
        badge: data.badge,
        rating: data.rating ?? 5.0,
        reviewCount: data.reviewCount ?? 0,
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

export interface CheckoutInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  paymentMethod?: string;
  items: { productId: number; quantity: number }[];
}

export const ordersApi = {
  checkout: async (data: CheckoutInput): Promise<Order> => {
    const res = await apiClient.post<any>("/api/orders/checkout", data);
    return res.data;
  },

  getByOrderNumber: async (orderNumber: string): Promise<Order> => {
    const res = await apiClient.get<any>(`/api/orders/${orderNumber}`);
    return res.data;
  },

  getAll: async (page = 0, size = 20): Promise<{ content: Order[]; totalElements: number }> => {
    const res = await apiClient.get<{ content: Order[]; totalElements: number }>("/api/orders", {
      params: { page, size },
    });
    return res.data;
  },
};

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string; size: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ url: string; filename: string; size: number }>(
      "/api/uploads",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },
};

export interface BakongQrData {
  orderNumber: string;
  amount: number;
  currency: string;
  accountId: string;
  accountName: string;
  storeLabel: string;
  qrString: string;
  md5Hash: string;
  qrImageBase64: string;
}

export interface PaymentVerificationResult {
  orderNumber: string;
  isPaid: boolean;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  paymentGateway: string;
  transactionId: string;
  message: string;
}

export interface AbaCheckoutPayload {
  purchaseUrl: string;
  reqTime: string;
  merchantId: string;
  tranId: string;
  amount: string;
  items: string;
  shipping: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  paymentOption: string;
  returnUrl: string;
  cancelUrl: string;
  continueSuccessUrl: string;
  currency: string;
  hash: string;
  formData: Record<string, string>;
}

export const paymentsApi = {
  generateBakongQr: async (orderNumber: string): Promise<BakongQrData> => {
    const res = await apiClient.post<BakongQrData>(`/api/payments/bakong/generate/${orderNumber}`);
    return res.data;
  },

  checkBakongStatus: async (orderNumber: string, md5Hash?: string): Promise<PaymentVerificationResult> => {
    const res = await apiClient.post<PaymentVerificationResult>("/api/payments/bakong/check-status", null, {
      params: { orderNumber, md5Hash: md5Hash || "" },
    });
    return res.data;
  },

  createAbaCheckout: async (orderNumber: string, paymentOption?: string): Promise<AbaCheckoutPayload> => {
    const res = await apiClient.post<AbaCheckoutPayload>(`/api/payments/aba/create-checkout/${orderNumber}`, null, {
      params: { paymentOption: paymentOption || "" },
    });
    return res.data;
  },

  checkAbaStatus: async (orderNumber: string): Promise<PaymentVerificationResult> => {
    const res = await apiClient.post<PaymentVerificationResult>(`/api/payments/aba/check-status/${orderNumber}`);
    return res.data;
  },

  simulateSuccess: async (orderNumber: string, gateway: string = "BAKONG_KHQR"): Promise<PaymentVerificationResult> => {
    const res = await apiClient.post<PaymentVerificationResult>("/api/payments/simulate-success", null, {
      params: { orderNumber, gateway },
    });
    return res.data;
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
