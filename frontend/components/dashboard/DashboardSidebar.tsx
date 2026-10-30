"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Tag,
  Users,
  FileText,
  Store,
  Receipt,
  CreditCard,
  BarChart3,
  Percent,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Calculator,
  User,
  EyeOff,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export type DashboardSection =
  | "dashboard"
  | "pos"
  | "orders"
  | "products"
  | "categories"
  | "brands"
  | "customers"
  | "content"
  | "invoices"
  | "transactions"
  | "reports"
  | "analytics"
  | "discounts"
  | "settings"
  | "account";

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  orderCount?: number;
}

export function DashboardSidebar({
  activeSection,
  setActiveSection,
  collapsed,
  setCollapsed,
  orderCount = 12,
}: DashboardSidebarProps) {
  const {
    role: baseRole,
    effectiveRole,
    isAdmin,
    isCustomer,
    previewRole,
    setPreviewRole,
  } = useAuth();
  const [financesOpen, setFinancesOpen] = React.useState(true);

  const customerNav = [
    { id: "account", label: "Profile Dashboard", icon: User },
    { id: "orders", label: "My Store Orders", icon: ShoppingBag, isExternal: true, href: "/orders" },
    { id: "store", label: "Storefront Catalog", icon: Store, isExternal: true, href: "/shop" },
  ];

  const mainNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pos", label: "POS Terminal", icon: Calculator, badge: "POS" },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: orderCount },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "brands", label: "Brands", icon: Tag },
    { id: "customers", label: "Users & Roles", icon: Users },
    { id: "content", label: "Content", icon: FileText },
    { id: "store", label: "Online Store", icon: Store, isExternal: true, href: "/" },
  ];

  const financesNav = [
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } shrink-0 transition-all duration-300 bg-white dark:bg-[#111827] border-r border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between z-30 sticky top-0 h-screen select-none`}
    >
      <div>
        {/* Brand & Collapse Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${
              isCustomer
                ? "from-teal-600 via-emerald-600 to-teal-500 shadow-teal-500/25"
                : "from-blue-600 via-indigo-600 to-cyan-500 shadow-blue-500/25"
            } flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}>
              <Cpu className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    DIGITAX
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-blue-600 text-white uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                  isCustomer
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                  {isCustomer ? "Customer Profile" : "Admin Portal"}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {/* CUSTOMER MODE NAVIGATION */}
          {isCustomer ? (
            <div className="space-y-1.5">
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Customer Menu
              </div>
              {customerNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id || (item.id === "account" && activeSection === "dashboard");

                if (item.isExternal) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href || "/"}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60 transition-colors"
                      title={item.label}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as DashboardSection)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-600/30 font-bold"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60"
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-white" : "text-teal-600 dark:text-teal-400"
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* ADMIN / STAFF MODE NAVIGATION */
            <>
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                if (item.isExternal) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href || "/"}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60 transition-colors"
                      title={item.label}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-slate-500 dark:text-zinc-400" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as DashboardSection)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60"
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-white" : "text-slate-500 dark:text-zinc-400"
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* FINANCES Accordion */}
              <div className="pt-3">
                {!collapsed ? (
                  <button
                    onClick={() => setFinancesOpen(!financesOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                  >
                    <span>FINANCES</span>
                    {financesOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                ) : (
                  <div className="h-px bg-slate-200 dark:bg-zinc-800 my-2" />
                )}

                {(financesOpen || collapsed) && (
                  <div className="space-y-1 mt-1">
                    {financesNav.map((f) => {
                      const Icon = f.icon;
                      const isActive = activeSection === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setActiveSection(f.id as DashboardSection)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                              : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/70 dark:hover:bg-zinc-800/40"
                          }`}
                          title={f.label}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {!collapsed && <span>{f.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Additional Links */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveSection("discounts")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeSection === "discounts"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60"
                  }`}
                  title="Discounts"
                >
                  <Percent className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Discounts</span>}
                </button>
                <button
                  onClick={() => setActiveSection("settings")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeSection === "settings"
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-800/60"
                  }`}
                  title="Settings"
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Settings</span>}
                </button>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Role-Specific Bottom Card */}
      {isCustomer ? (
        previewRole === "CUSTOMER" ? (
          !collapsed ? (
            <div className="p-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Customer Preview</span>
                </div>
                <p className="text-[11px] text-amber-700/90 dark:text-amber-400 mt-1 leading-snug">
                  You are previewing how customers see their account.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewRole(null)}
                  className="mt-2.5 w-full h-7 text-xs font-bold border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 shadow-2xs"
                >
                  Exit Preview
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 flex justify-center">
              <button
                onClick={() => setPreviewRole(null)}
                title="Exit Customer Preview"
                className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          )
        ) : (
          !collapsed && (
            <div className="p-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg shadow-teal-500/15">
                <h4 className="font-extrabold text-xs">Customer Support</h4>
                <p className="text-[11px] text-teal-100/90 mt-1 leading-snug">
                  Manage shipping addresses and track current order statuses.
                </p>
                <Link href="/">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-3 w-full h-7 text-xs font-bold bg-white text-teal-700 hover:bg-teal-50"
                  >
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>
          )
        )
      ) : (
        /* Admin System Health & POS Card */
        !collapsed ? (
          <div className="p-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white dark:bg-zinc-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  System Live Status
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="text-[11px] space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Spring Boot</span>
                  <span className="font-mono text-[10px] font-bold text-cyan-300">:8083 Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PostgreSQL</span>
                  <span className="font-mono text-[10px] font-bold text-slate-300">:5432 Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Payment POS</span>
                  <span className="font-mono text-[10px] font-bold text-rose-400">Bakong KHQR</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection("pos")}
                className="mt-3 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Open POS Terminal</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 flex justify-center">
            <button
              onClick={() => setActiveSection("pos")}
              title="Open POS Terminal"
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
            >
              <Calculator className="w-4 h-4" />
            </button>
          </div>
        )
      )}
    </aside>
  );
}
