"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/providers/ThemeProvider";
import { useBackendHealth } from "@/hooks/useStoreData";
import Link from "next/link";

interface DashboardHeaderProps {
  onAddProduct: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function DashboardHeader({
  onAddProduct,
  searchQuery,
  setSearchQuery,
}: DashboardHeaderProps) {
  const { user } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const { data: isBackendOnline } = useBackendHealth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 px-6 border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4 transition-colors">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Input
          type="text"
          placeholder="Search products, orders, customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-400" />}
          className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs h-9"
        />
        <div className="absolute right-2.5 top-2 hidden sm:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-zinc-500 bg-slate-200/60 dark:bg-zinc-800 rounded">
            ⌘K
          </kbd>
        </div>
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

        {/* Quick Add Product Button */}
        <Button
          onClick={onAddProduct}
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Product</span>
        </Button>

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

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors border border-slate-200/60 dark:border-zinc-800 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-zinc-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-zinc-800 shadow-xl p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                  Notifications
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
                  <p className="font-semibold text-slate-800 dark:text-zinc-200">
                    New Order #ORD-8492
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    MacBook Pro 16 ordered by activatorcode9999
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/40">
                  <p className="font-semibold text-slate-800 dark:text-zinc-200">
                    Low Stock Alert
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    ASUS ROG Strix RTX 4090 OC has 8 units remaining.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Button */}
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
              {user?.fullName || user?.username || "Admin"}
            </span>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              ADMIN
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
