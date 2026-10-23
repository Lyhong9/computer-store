"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Trash2,
  Plus,
  Minus,
  Tag,
  Bell,
  Settings,
  UserPlus,
  ChevronDown,
  CreditCard,
  QrCode,
  RotateCcw,
  Check,
  CheckCircle2,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Product, Category, Order } from "@/types/store";
import { productsApi, categoriesApi, ordersApi } from "@/services/api";
import { INITIAL_PRODUCTS, CATEGORIES } from "@/data/sampleProducts";
import { BakongKhqrModal } from "@/components/BakongKhqrModal";
import { AbaPaywayModal } from "@/components/AbaPaywayModal";

interface PosCartItem {
  product: Product;
  quantity: number;
  spec?: string;
}

export function DashboardPosTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"BAKONG_KHQR" | "ABA_PAYWAY" | "CASH">("BAKONG_KHQR");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [showBakongModal, setShowBakongModal] = useState<boolean>(false);
  const [showAbaModal, setShowAbaModal] = useState<boolean>(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [cashierName, setCashierName] = useState<string>("Dam Lyhong (Cashier #01)");

  // Load products & categories from backend
  useEffect(() => {
    let isMounted = true;
    productsApi
      .getAll()
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : (data as any)?.content || [];
          if (list.length > 0) {
            setProducts(list);
          } else {
            setProducts(INITIAL_PRODUCTS);
          }
        }
      })
      .catch(() => {
        if (isMounted) setProducts(INITIAL_PRODUCTS);
      });

    categoriesApi
      .getAll()
      .then((data) => {
        if (isMounted && data.length > 0) {
          setCategories(data);
        } else if (isMounted) {
          setCategories(CATEGORIES);
        }
      })
      .catch(() => {
        if (isMounted) setCategories(CATEGORIES);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      const cat = p.categoryName || "Others";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter products by category & search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (p.categoryName && p.categoryName.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart operations
  const addToPosCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          spec: product.categoryName === "Processors" ? "Socket AM5 / LGA" : "Standard",
        },
      ];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[]
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const resetOrder = () => {
    setCart([]);
    setDiscountPercent(0);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  // For testing real payment, tax can be 0 or standard
  const tax = 0;
  const total = Math.max(0.1, Number((subtotal - discountAmount + tax).toFixed(2)));

  // Checkout submission
  const handleProceedToPayment = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    const orderPayload = {
      customerName: "Walk-in Customer (POS)",
      customerEmail: "pos.store@computer-ecommerce.com",
      customerPhone: "855968999414",
      shippingAddress: "POS Store Counter, Phnom Penh",
      paymentMethod,
      items: cart.map((i) => ({
        productId: Number(i.product.id),
        quantity: i.quantity,
      })),
    };

    try {
      const backendOrder = await ordersApi.checkout(orderPayload);
      const formatted: Order = {
        id: (backendOrder as any).orderNumber || String(backendOrder.id),
        createdAt: new Date().toISOString(),
        customerName: backendOrder.customerName,
        customerEmail: backendOrder.customerEmail,
        customerPhone: backendOrder.customerPhone || "855968999414",
        shippingAddress: backendOrder.shippingAddress,
        paymentMethod: backendOrder.paymentMethod || paymentMethod,
        items: cart.map((c) => ({
          product: c.product,
          quantity: c.quantity,
        })),
        subtotal,
        tax,
        total: Number(backendOrder.total) || total,
        status: (backendOrder.status as any) || "CONFIRMED",
      };

      setIsSubmitting(false);

      if (paymentMethod === "BAKONG_KHQR") {
        setActivePaymentOrder(formatted);
        setShowBakongModal(true);
      } else if (paymentMethod === "ABA_PAYWAY") {
        setActivePaymentOrder(formatted);
        setShowAbaModal(true);
      } else {
        // Cash payment instant complete
        setLastCompletedOrder(formatted);
        resetOrder();
      }
    } catch (err) {
      console.warn("Backend POS checkout fallback:", err);
      const mockOrder: Order = {
        id: "POS-" + Date.now().toString().slice(-6),
        createdAt: new Date().toISOString(),
        customerName: "Walk-in Customer",
        customerEmail: "pos.customer@example.com",
        customerPhone: "855968999414",
        shippingAddress: "POS Store Counter, Phnom Penh",
        paymentMethod,
        items: cart.map((c) => ({
          product: c.product,
          quantity: c.quantity,
        })),
        subtotal,
        tax,
        total,
        status: "CONFIRMED",
      };

      setIsSubmitting(false);

      if (paymentMethod === "BAKONG_KHQR") {
        setActivePaymentOrder(mockOrder);
        setShowBakongModal(true);
      } else if (paymentMethod === "ABA_PAYWAY") {
        setActivePaymentOrder(mockOrder);
        setShowAbaModal(true);
      } else {
        setLastCompletedOrder(mockOrder);
        resetOrder();
      }
    }
  };

  const handlePaymentSuccess = (confirmed: Order) => {
    setShowBakongModal(false);
    setShowAbaModal(false);
    setActivePaymentOrder(null);
    setLastCompletedOrder(confirmed);
    resetOrder();
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200/80 dark:border-zinc-800 shadow-sm">
      {/* 1. POS Top Bar: Title & Cashier Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-zinc-800/80 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Transaction
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Fast Point-of-Sale with live Bakong KHQR &amp; ABA PayWay integration ($0.10 test enabled)
          </p>
        </div>

        {/* Top Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors relative shadow-xs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
          </button>

          {/* Settings */}
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Team / Staff Avatars Stack */}
          <div className="hidden sm:flex items-center -space-x-2 border-r border-slate-200 dark:border-zinc-800 pr-3 mr-1">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
              alt="Cashier 1"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
              alt="Cashier 2"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
              alt="Cashier 3"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 object-cover"
            />
          </div>

          {/* New Access Button */}
          <button
            type="button"
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>New Access</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              DL
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* LEFT COLUMN: Product Catalog (Cols 1-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Filter Pills & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none">
              {/* All Products Tab */}
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-[#c6f052] text-slate-950 shadow-sm font-extrabold"
                    : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:border-slate-300"
                }`}
              >
                <span>All Product</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    selectedCategory === "all"
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-500"
                  }`}
                >
                  {categoryCounts["all"] || products.length}
                </span>
              </button>

              {/* Dynamic Categories */}
              {["Processors", "Graphics Cards", "Laptops", "Monitors", "Accessories"].map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                      isSelected
                        ? "bg-[#c6f052] text-slate-950 shadow-sm font-extrabold"
                        : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:border-slate-300"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isSelected
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Pill */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c6f052] transition-all"
              />
            </div>
          </div>

          {/* Product Cards Grid: 3 Columns matching user image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((p) => {
              const inCartItem = cart.find((i) => i.product.id === p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
                >
                  {/* Stock Badge Top Left */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/90 text-white text-[10px] font-bold shadow-xs">
                      {p.quantityOnHand || 120} Stock
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-40 bg-slate-50/50 dark:bg-zinc-950/50 rounded-2xl p-2 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={p.primaryImage || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80"}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-clamp-2 leading-relaxed min-h-[32px]">
                      {p.description || "High-performance hardware component engineered for reliability and gaming."}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ${Number(p.price).toFixed(2)}
                      </span>
                      {inCartItem && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {inCartItem.quantity} in cart
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    type="button"
                    onClick={() => addToPosCart(p)}
                    className="mt-3.5 w-full py-2.5 px-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-750 text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: "Detail Transaction" Panel (Cols 9-12) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 sticky top-20">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Detail Transaction
            </h2>
            <button
              type="button"
              onClick={resetOrder}
              disabled={cart.length === 0}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 disabled:opacity-30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Order</span>
            </button>
          </div>

          {/* Cart Item Cards List */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                  Transaction is empty
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-0.5">
                  Click &apos;+ Add to Cart&apos; to ring up items
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-3 group"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 p-1 shrink-0 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-center">
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100 truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">
                          Qty {item.quantity} × ${Number(item.product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Line Total */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="w-6 h-6 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center transition-colors text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    {/* Quantity Pill with Lime + */}
                    <div className="flex items-center bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-700 px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-300 text-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="px-2 text-xs font-black text-slate-900 dark:text-white">
                        {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded-full bg-[#c6f052] hover:bg-[#b2dc3b] flex items-center justify-center text-slate-950 font-bold text-xs"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Promo Code Pill Box */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🏷️</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                {discountPercent > 0 ? `Promo Discount (${discountPercent}%)` : "Apply Store Promo"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDiscountPercent(discountPercent === 0 ? 10 : 0)}
              className="px-3 py-1 rounded-full bg-[#c6f052] hover:bg-[#b5e042] text-slate-950 font-extrabold text-[11px] transition-colors"
            >
              {discountPercent > 0 ? "Remove" : "10% Off"}
            </button>
          </div>

          {/* Transaction Summary Breakdown */}
          <div className="space-y-2 pt-2 text-xs border-t border-slate-100 dark:border-zinc-800">
            <div className="flex justify-between text-slate-500 dark:text-zinc-400">
              <span>Sub-Total</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 dark:text-zinc-400">
              <span>Tax (0% POS)</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-zinc-800">
              <span>Total Payment</span>
              <span className="text-lg text-slate-950 dark:text-[#c6f052] font-black">
                ${total.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Payment Method Selector Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              {paymentMethod === "BAKONG_KHQR" ? (
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-[9px] flex items-center justify-center">
                  KHQR
                </div>
              ) : paymentMethod === "ABA_PAYWAY" ? (
                <div className="w-7 h-7 rounded-lg bg-[#003366] text-white font-black text-[9px] flex items-center justify-center">
                  ABA
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                  💵
                </div>
              )}
              <div>
                <span className="font-bold text-slate-800 dark:text-zinc-200 block text-xs">
                  {paymentMethod === "BAKONG_KHQR"
                    ? "Bakong KHQR ($0.10)"
                    : paymentMethod === "ABA_PAYWAY"
                    ? "ABA PayWay ($0.10)"
                    : "Cash Tendered"}
                </span>
                <span className="text-[10px] text-slate-400">Cambodia Real-Time Gateway</span>
              </div>
            </div>

            {/* Change Method cycle */}
            <button
              type="button"
              onClick={() => {
                if (paymentMethod === "BAKONG_KHQR") setPaymentMethod("ABA_PAYWAY");
                else if (paymentMethod === "ABA_PAYWAY") setPaymentMethod("CASH");
                else setPaymentMethod("BAKONG_KHQR");
              }}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Change Method &gt;
            </button>
          </div>

          {/* Big Lime-Green Continue Button (Matching User Image) */}
          <button
            type="button"
            id="pos-continue-btn"
            onClick={handleProceedToPayment}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#c6f052] hover:bg-[#b5e042] active:scale-[0.98] text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-[#c6f052]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Generating {paymentMethod}...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <span className="text-xs font-extrabold opacity-75">
                  (${total.toFixed(2)})
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Completed Order Receipt Card Banner */}
      {lastCompletedOrder && (
        <div className="mt-8 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              ✓
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">
                Transaction Completed: {lastCompletedOrder.id}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                Amount Paid: ${Number(lastCompletedOrder.total).toFixed(2)} via {lastCompletedOrder.paymentMethod}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={() => setLastCompletedOrder(null)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs"
            >
              Done / Next Customer
            </button>
          </div>
        </div>
      )}

      {/* 4. Live Payment Modals (Bakong KHQR and ABA PayWay) */}
      <BakongKhqrModal
        isOpen={showBakongModal}
        order={activePaymentOrder}
        onClose={() => {
          setShowBakongModal(false);
          setActivePaymentOrder(null);
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AbaPaywayModal
        isOpen={showAbaModal}
        order={activePaymentOrder}
        onClose={() => {
          setShowAbaModal(false);
          setActivePaymentOrder(null);
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
