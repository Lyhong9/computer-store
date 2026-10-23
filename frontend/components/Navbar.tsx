"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Show, UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function Navbar({
  onSearchChange,
  searchQuery = "",
  selectedCategory = "all",
  onSelectCategory,
}: NavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as string) || "customer";

  // Silent sync to PostgreSQL backend
  useEffect(() => {
    if (user) {
      fetch("/api/sync-user", { method: "POST" }).catch(() => {});
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 font-black text-xl text-white group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  TechShop
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium block -mt-0.5">
                Hardware & Gaming Systems
              </span>
            </div>
          </Link>

          {/* Quick Search */}
          {onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  id="navbar-search-input"
                  placeholder="Search laptops, RTX 4090, Ryzen CPUs..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-400 mr-2">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Storefront
              </Link>
              <Link
                href="/orders"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-zinc-900 transition-colors"
              >
                My Orders
              </Link>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  Account
                </Link>
              </Show>
            </nav>

            {/* Cart Trigger Button */}
            <button
              id="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-200 transition-all flex items-center gap-2 group"
              aria-label="Open Shopping Cart"
            >
              <span className="text-base group-hover:scale-110 transition-transform">🛒</span>
              <span className="text-xs font-semibold hidden sm:inline text-zinc-300">
                Cart
              </span>
              {totalItems > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-md shadow-indigo-600/50">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Authentication States */}
            <Show when="signed-out">
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  id="nav-signin-link"
                  className="text-xs sm:text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  id="nav-signup-link"
                  className="text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/25 transition-all"
                >
                  Register
                </Link>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  {role}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border border-zinc-700 shadow-md",
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}
