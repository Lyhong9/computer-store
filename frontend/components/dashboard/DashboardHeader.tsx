"use client";

import React, { useState, useMemo } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Radio,
  ExternalLink,
  Laptop,
  Users,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/providers/ThemeProvider";
import { useBackendHealth, useProducts } from "@/hooks/useStoreData";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CommandPaletteModal } from "@/components/dashboard/CommandPaletteModal";
import { DashboardSection } from "@/components/dashboard/DashboardSidebar";

interface DashboardHeaderProps {
  onAddProduct: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNavigate?: (sec: DashboardSection) => void;
}

export function DashboardHeader({
  onAddProduct,
  searchQuery,
  setSearchQuery,
  onNavigate,
}: DashboardHeaderProps) {
  const { user } = useUser();
  const {
    user: authUser,
    role: baseRole,
    effectiveRole,
    isAdmin,
    previewRole,
    setPreviewRole,
  } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { data: isBackendOnline } = useBackendHealth();
  const { orders } = useCart();
  const { data: products = [] } = useProducts();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Dynamic Real-time Notifications
  const lowStockAlerts = useMemo(() => {
    return products.filter((p) => (p.quantityOnHand || 0) <= 10).slice(0, 3);
  }, [products]);

  const pendingOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === "CONFIRMED" || o.status === "PROCESSING")
      .slice(0, 3);
  }, [orders]);

  const totalAlertCount = lowStockAlerts.length + pendingOrders.length;

  return (
    <>
      <header className="h-16 px-6 border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4 transition-colors">
        {/* Search Input triggering Command Palette */}
        <div className="flex-1 max-w-md relative">
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between h-9 px-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-400 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search products, orders, commands...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-zinc-500 bg-slate-200/60 dark:bg-zinc-800 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Backend status indicator */}
          <div
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/70 dark:border-zinc-700/60"
            title={
              isBackendOnline
                ? "Spring Boot Backend Connected (Port 8083)"
                : "Backend Offline (Resilient Fallback Mode)"
            }
          >
            <span className="relative flex h-2 w-2">
              {isBackendOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBackendOnline ? "bg-emerald-500" : "bg-amber-500"
                }`}
              ></span>
            </span>
            <span className="text-[11px] text-slate-600 dark:text-zinc-300">
              {isBackendOnline ? "API Live" : "Fallback Mode"}
            </span>
          </div>

          {/* View Storefront Link */}
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex text-xs h-8 gap-1.5 text-slate-600 dark:text-zinc-300"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Button>
          </Link>

          {/* Admin Role Preview Toggle */}
          {baseRole === "ADMIN" && (
            <div>
              {previewRole === "CUSTOMER" ? (
                <button
                  onClick={() => setPreviewRole(null)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-xs"
                  title="Currently viewing dashboard as a Customer. Click to return to Admin mode."
                >
                  <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden md:inline">Viewing as Customer</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white font-extrabold uppercase">
                    Exit Preview
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setPreviewRole("CUSTOMER")}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all border border-slate-200 dark:border-zinc-700"
                  title="Preview the dashboard interface as a customer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preview as Customer</span>
                </button>
              )}
            </div>
          )}

          {/* Quick Add Product Button (Admin only) */}
          {isAdmin && (
            <Button
              onClick={onAddProduct}
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          )}

          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors border border-slate-200/60 dark:border-zinc-800"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-90 duration-300" />
            )}
          </button>

          {/* Dynamic Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors border border-slate-200/60 dark:border-zinc-800 relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {totalAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                  {totalAlertCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-zinc-800 shadow-xl p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                    Live Alerts ({totalAlertCount})
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-xs max-h-64 overflow-y-auto">
                  {/* Pending Orders Alerts */}
                  {pendingOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate?.("orders");
                      }}
                      className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-blue-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>Order #{o.id} ({o.status})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-300 mt-0.5">
                        {o.customerName} placed order (${o.total})
                      </p>
                    </div>
                  ))}

                  {/* Low Stock Alerts */}
                  {lowStockAlerts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate?.("products");
                      }}
                      className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 cursor-pointer hover:bg-amber-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low Stock Warning</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-300 mt-0.5 line-clamp-1">
                        {p.name} has only {p.quantityOnHand} units remaining.
                      </p>
                    </div>
                  ))}

                  {totalAlertCount === 0 && (
                    <div className="py-6 text-center text-slate-400">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                      <p className="font-semibold text-[11px]">All caught up!</p>
                      <p className="text-[10px] mt-0.5">No pending orders or low inventory alerts.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Button & Dynamic Role Badge */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-zinc-800">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 rounded-xl",
                },
              }}
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                {authUser?.firstName || user?.fullName || user?.username || "User"}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  effectiveRole === "ADMIN"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-teal-600 dark:text-teal-400"
                }`}
              >
                {effectiveRole}
                {previewRole === "CUSTOMER" && " (PREVIEW)"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(sec) => {
          setIsCommandPaletteOpen(false);
          onNavigate?.(sec);
        }}
        onAddProduct={() => {
          setIsCommandPaletteOpen(false);
          onAddProduct();
        }}
        products={products}
        orders={orders}
      />
    </>
  );
}
