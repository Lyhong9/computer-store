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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type DashboardSection =
  | "dashboard"
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
  | "settings";

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
  const [financesOpen, setFinancesOpen] = React.useState(true);

  const mainNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: orderCount },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "brands", label: "Brands", icon: Tag },
    { id: "customers", label: "Customers", icon: Users },
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/25 shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  Shopeers
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                  Hardware Admin
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
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
        </nav>
      </div>

      {/* Upgrade Banner in Bottom Sidebar */}
      {!collapsed ? (
        <div className="p-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 rounded-full bg-white/10 blur-md pointer-events-none" />
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-extrabold text-sm leading-tight text-white">
              Upgrade to Pro
            </h4>
            <p className="text-[11px] text-blue-100/90 mt-1 leading-snug">
              Unlock AI analytics, auto-restocking & multi-store sync.
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full h-8 text-xs font-bold bg-white text-blue-600 hover:bg-blue-50 shadow-xs"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      )}
    </aside>
  );
}
