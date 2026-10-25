"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  LayoutDashboard,
  Calculator,
  ShoppingBag,
  Package,
  FolderTree,
  Tag,
  Users,
  FileText,
  Receipt,
  Settings,
  Plus,
  ArrowRight,
  ExternalLink,
  Command,
  X,
  CreditCard,
  Percent,
} from "lucide-react";
import { Product, Order } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { DashboardSection } from "@/components/dashboard/DashboardSidebar";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: DashboardSection) => void;
  onAddProduct: () => void;
  products: Product[];
  orders: Order[];
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onAddProduct,
  products,
  orders,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const NAV_ITEMS: { id: DashboardSection; label: string; icon: any; category: string }[] = [
    { id: "dashboard", label: "Overview Dashboard", icon: LayoutDashboard, category: "Navigation" },
    { id: "pos", label: "POS Terminal (Cashier)", icon: Calculator, category: "Navigation" },
    { id: "orders", label: "Orders Management", icon: ShoppingBag, category: "Navigation" },
    { id: "products", label: "Products Catalog", icon: Package, category: "Navigation" },
    { id: "categories", label: "Categories Manager", icon: FolderTree, category: "Navigation" },
    { id: "brands", label: "Brands & Vendors", icon: Tag, category: "Navigation" },
    { id: "customers", label: "Users & Roles", icon: Users, category: "Navigation" },
    { id: "content", label: "Content CMS & Banners", icon: FileText, category: "Navigation" },
    { id: "invoices", label: "Invoices & Billing", icon: Receipt, category: "Navigation" },
    { id: "transactions", label: "Transactions Ledger", icon: CreditCard, category: "Navigation" },
    { id: "discounts", label: "Promotions & Discounts", icon: Percent, category: "Navigation" },
    { id: "settings", label: "Store Settings", icon: Settings, category: "Navigation" },
  ];

  // Filter navigation
  const filteredNav = NAV_ITEMS.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  // Filter products (max 4)
  const matchedProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
    : [];

  // Filter orders (max 3)
  const matchedOrders = query.trim()
    ? orders
        .filter(
          (o) =>
            o.id.toLowerCase().includes(query.toLowerCase()) ||
            o.customerName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const handleSelectNav = (sec: DashboardSection) => {
    onNavigate(sec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search products, orders, navigation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 rounded-md border border-slate-200 dark:border-zinc-700">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-3 overflow-y-auto space-y-4 text-xs">
          {/* Quick Actions */}
          <div>
            <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-slate-400">
              Quick Actions
            </p>
            <div className="space-y-1 mt-1">
              <button
                onClick={() => {
                  onClose();
                  onAddProduct();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-800 dark:text-zinc-200 group transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <Plus className="w-4 h-4" />
                  </span>
                  <span className="font-bold">Add New Hardware Product</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => handleSelectNav("pos")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-800 dark:text-zinc-200 group transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                    <Calculator className="w-4 h-4" />
                  </span>
                  <span className="font-bold">Open POS Cashier Terminal</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Products ({matchedProducts.length})
              </p>
              <div className="space-y-1 mt-1">
                {matchedProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectNav("products")}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-800 dark:text-zinc-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600">
                        <Package className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold block truncate max-w-sm">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.sku} • {p.categoryName || "Hardware"}
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-blue-600 font-mono">
                      {formatCurrency(p.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Orders ({matchedOrders.length})
              </p>
              <div className="space-y-1 mt-1">
                {matchedOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleSelectNav("orders")}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-800 dark:text-zinc-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600">
                        <ShoppingBag className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-bold font-mono text-blue-600 block">{o.id}</span>
                        <span className="text-[10px] text-slate-400">{o.customerName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 dark:text-zinc-50 block">
                        {formatCurrency(o.total)}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {o.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div>
            <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-slate-400">
              Navigation & Sections
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
              {filteredNav.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 transition-colors text-left"
                  >
                    <IconComponent className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or tap ESC to close</span>
          <span className="font-semibold text-slate-600 dark:text-zinc-300">
            TechShop Command Center
          </span>
        </div>
      </div>
    </div>
  );
}
