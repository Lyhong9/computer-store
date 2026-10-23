"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Order, Product } from "@/types/store";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (customerDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
  }) => Order;
  addCompletedOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart and orders from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("techshop_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedOrders = localStorage.getItem("techshop_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Seed default store orders for immediate dashboard insights
        const demoOrders: Order[] = [
          {
            id: "ORD-942817-482",
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            customerName: "Sokha Meng",
            customerEmail: "sokha.meng@example.com",
            customerPhone: "+855 12 889 900",
            shippingAddress: "Toul Kork, St 315, Phnom Penh",
            paymentMethod: "KHQR",
            items: [
              {
                product: {
                  id: 1,
                  sku: "MBP-16-M3MAX",
                  name: 'MacBook Pro 16" M3 Max',
                  description: "16-core CPU, 40-core GPU, 48GB Unified Memory",
                  price: 3499.0,
                  quantityOnHand: 15,
                  active: true,
                  categoryName: "Laptops",
                  brandName: "Apple",
                },
                quantity: 1,
              },
            ],
            subtotal: 3499.0,
            tax: 279.92,
            total: 3778.92,
            status: "PROCESSING",
          },
          {
            id: "ORD-831924-192",
            createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
            customerName: "Vannak Chan",
            customerEmail: "vannak.chan@example.com",
            customerPhone: "+855 77 234 567",
            shippingAddress: "BKK1, St 51, Phnom Penh",
            paymentMethod: "Credit Card",
            items: [
              {
                product: {
                  id: 3,
                  sku: "RTX-4090-ROG",
                  name: "ASUS ROG Strix GeForce RTX 4090 OC",
                  description: "24GB GDDR6X, Ada Lovelace architecture",
                  price: 1999.0,
                  quantityOnHand: 8,
                  active: true,
                  categoryName: "Graphics Cards",
                  brandName: "ASUS ROG",
                },
                quantity: 2,
              },
            ],
            subtotal: 3998.0,
            tax: 319.84,
            total: 4317.84,
            status: "SHIPPED",
          },
          {
            id: "ORD-720184-593",
            createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
            customerName: "Bopha Rath",
            customerEmail: "bopha.rath@example.com",
            customerPhone: "+855 98 123 456",
            shippingAddress: "Chroy Changvar, Phnom Penh",
            paymentMethod: "KHQR",
            items: [
              {
                product: {
                  id: 5,
                  sku: "AMD-7950X3D",
                  name: "AMD Ryzen 9 7950X3D Desktop Processor",
                  description: "16 Cores, 32 Threads, 144MB 3D V-Cache",
                  price: 599.0,
                  quantityOnHand: 30,
                  active: true,
                  categoryName: "Processors",
                  brandName: "AMD",
                },
                quantity: 1,
              },
            ],
            subtotal: 599.0,
            tax: 47.92,
            total: 646.92,
            status: "DELIVERED",
          },
        ];
        setOrders(demoOrders);
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("techshop_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Error saving cart to localStorage", e);
      }
    }
  }, [items, isInitialized]);

  // Save orders to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("techshop_orders", JSON.stringify(orders));
      } catch (e) {
        console.error("Error saving orders to localStorage", e);
      }
    }
  }, [orders, isInitialized]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 0% tax (Tax removed per store policy)
  const tax = 0;

  // Free shipping on all orders (0.00 fee)
  const shipping = 0;

  const total = Number(subtotal.toFixed(2));

  const placeOrder = (details: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
  }): Order => {
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
      createdAt: new Date().toISOString(),
      customerName: details.customerName,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      shippingAddress: details.shippingAddress,
      paymentMethod: details.paymentMethod,
      items: [...items],
      subtotal,
      tax,
      total,
      status: "CONFIRMED",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const addCompletedOrder = (order: Order) => {
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.id !== order.id);
      return [order, ...filtered];
    });
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        tax,
        shipping,
        total,
        isCartOpen,
        setIsCartOpen,
        orders,
        placeOrder,
        addCompletedOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
