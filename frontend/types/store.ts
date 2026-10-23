export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantityOnHand: number;
  active: boolean;
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  specs?: Record<string, string>;
  featured?: boolean;
  images?: string[];
  primaryImage?: string;
  rating?: number;
  soldCount?: number;
  badge?: "SALE" | "HOT" | "NEW";
  colors?: string[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon?: string;
  images?: string[];
  banner?: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  images?: string[];
  website?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
}
