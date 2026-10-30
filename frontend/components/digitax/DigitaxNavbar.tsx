"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser, UserButton, Show } from "@clerk/nextjs";
import {
  Search,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Menu,
  ChevronDown,
  Headset,
  X,
  Laptop,
  Smartphone,
  Cpu,
  Monitor,
  Gamepad2,
  Watch,
  Headphones,
  HardDrive,
  Camera,
  Check,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Category } from "@/types/store";

interface DigitaxNavbarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: "home" | "shop";
  setActiveTab: (tab: "home" | "shop") => void;
}

export function DigitaxNavbar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeTab,
  setActiveTab,
}: DigitaxNavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlistItems, setIsWishlistOpen } = useWishlist();
  const { user } = useUser();

  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [featuredMenuOpen, setFeaturedMenuOpen] = useState(false);
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLang, setSelectedLang] = useState("ENG");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCategoryOpen, setSearchCategoryOpen] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchCategoryRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click and Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesMenuOpen(false);
      }
      if (
        searchCategoryRef.current &&
        !searchCategoryRef.current.contains(event.target as Node)
      ) {
        setSearchCategoryOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCategoriesMenuOpen(false);
        setSearchCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n === "all") return <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />;
    if (n.includes("laptop")) return <Laptop className="w-3.5 h-3.5 text-emerald-500" />;
    if (n.includes("mobile") || n.includes("phone"))
      return <Smartphone className="w-4 h-4 text-blue-500" />;
    if (n.includes("computer") || n.includes("desktop"))
      return <Cpu className="w-4 h-4 text-indigo-500" />;
    if (n.includes("monitor")) return <Monitor className="w-4 h-4 text-cyan-500" />;
    if (n.includes("game") || n.includes("console"))
      return <Gamepad2 className="w-4 h-4 text-purple-500" />;
    if (n.includes("smartwatch") || n.includes("watch"))
      return <Watch className="w-4 h-4 text-amber-500" />;
    if (n.includes("audio") || n.includes("headphone"))
      return <Headphones className="w-4 h-4 text-rose-500" />;
    if (n.includes("memory") || n.includes("storage"))
      return <HardDrive className="w-4 h-4 text-orange-500" />;
    if (n.includes("camera")) return <Camera className="w-4 h-4 text-teal-500" />;
    return <Cpu className="w-4 h-4 text-slate-500" />;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="w-full text-white select-none z-40 sticky top-0 shadow-2xl backdrop-blur-xl bg-[#090d1a]/95 border-b border-slate-800/80 transition-all duration-300">
      {/* Top micro glowing accent gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_12px_rgba(34,211,238,0.4)]" />

      {/* 1. TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-[#090d1a] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  DIGITAX
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded-md">
                  PRO
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
                Computer &amp; Gaming Store
              </span>
            </div>
          </Link>

          {/* Search Bar - Modern Frosted Tech Container */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center bg-slate-900/90 rounded-2xl p-1 pl-1.5 pr-2.5 shadow-inner border border-slate-750 focus-within:ring-2 focus-within:ring-cyan-500/40 focus-within:border-cyan-400 transition-all"
          >
            {/* Modern Category Dropdown */}
            <div className="relative shrink-0" ref={searchCategoryRef}>
              <button
                type="button"
                onClick={() => setSearchCategoryOpen(!searchCategoryOpen)}
                className="flex items-center gap-2 pl-3.5 pr-3 py-1.5 rounded-xl hover:bg-slate-800 active:bg-slate-750 transition-all text-xs font-semibold text-slate-300 hover:text-white select-none border-r border-slate-700/80 group cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={searchCategoryOpen}
              >
                <span className="shrink-0 group-hover:scale-110 transition-transform">
                  {selectedCategory === "all" ? (
                    <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    getCategoryIcon(selectedCategory)
                  )}
                </span>
                <span className="max-w-[120px] truncate font-bold group-hover:text-cyan-300 transition-colors">
                  {selectedCategory === "all" ? "All Categories" : selectedCategory}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    searchCategoryOpen ? "rotate-180 text-cyan-400" : "group-hover:text-slate-300"
                  }`}
                />
              </button>

              {/* Floating Modern Category Dropdown Popover */}
              {searchCategoryOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.06)] border border-slate-100 p-2 animate-in fade-in-0 zoom-in-95 duration-150 origin-top-left">
                  <div className="flex items-center justify-between px-3 py-1.5 mb-1 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Category</span>
                    <span className="text-blue-600 font-bold">{categories.length + 1} items</span>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
                    {/* All Categories Option */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory("all");
                        setActiveTab("shop");
                        setSearchCategoryOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
                          : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            selectedCategory === "all"
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                          }`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </div>
                        <span>All Categories</span>
                      </div>
                      {selectedCategory === "all" && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>

                    {/* Category Options */}
                    {categories.map((c, idx) => {
                      const isSelected =
                        selectedCategory.toLowerCase() === c.name.toLowerCase();
                      return (
                        <button
                          key={`nav-cat-dropdown-${c.id || idx}-${c.name}`}
                          type="button"
                          onClick={() => {
                            onSelectCategory(c.name);
                            setActiveTab("shop");
                            setSearchCategoryOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
                              : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                              }`}
                            >
                              {getCategoryIcon(c.name)}
                            </div>
                            <span className="truncate max-w-[140px] text-left">{c.name}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Instant Search Input */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-3 mr-1 pointer-events-none" />
              <input
                type="text"
                placeholder="Search laptops, graphics cards, CPUs, monitors..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== "shop") {
                    setActiveTab("shop");
                  }
                }}
                className="w-full px-2 py-2 text-xs sm:text-sm text-white placeholder:text-slate-400 outline-none bg-transparent font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 mr-1 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Right Header Section: Support & Icons */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Direct Support Details */}
            <div className="hidden lg:flex items-center gap-2.5 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-2xl">
              <Headset className="w-5 h-5 text-cyan-400 stroke-[2]" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Bakong &amp; Phone POS
                </p>
                <p className="font-extrabold text-xs text-white tracking-wide font-mono">
                  +855 96 899 9414
                </p>
              </div>
            </div>

            {/* Icons Group: User, Wishlist, Cart */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-white">
              {/* Account Profile */}
              <Show when="signed-in">
                <div className="flex items-center">
                  <UserButton />
                </div>
              </Show>
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Sign In"
                >
                  <UserIcon className="w-4 h-4" />
                </Link>
              </Show>

              {/* Wishlist Icon */}
              <button
                type="button"
                id="header-wishlist-btn"
                onClick={() => setIsWishlistOpen(true)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors relative flex items-center group cursor-pointer"
                title={`Wishlist (${totalWishlistItems})`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    totalWishlistItems > 0 ? "text-rose-400 fill-rose-500" : ""
                  }`}
                />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-rose-500/40">
                    {totalWishlistItems}
                  </span>
                )}
              </button>

              {/* Shopping Cart Icon with Badge */}
              <button
                type="button"
                id="header-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors relative flex items-center group cursor-pointer"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-blue-500/40">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Dashboard Link with glowing badge */}
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black tracking-wider text-cyan-300 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-400/40 hover:bg-cyan-500/25 hover:border-cyan-300 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>DASHBOARD</span>
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-white hover:text-[#00e676] transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white rounded-full p-1 pl-3.5 pr-2 shadow-md border border-white/20 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-1.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== "shop") {
                  setActiveTab("shop");
                }
              }}
              className="flex-1 px-1 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-12">
            {/* Left: ALL CATEGORIES Dropdown Button */}
            <div className="relative" ref={categoriesRef}>
              <button
                type="button"
                onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
                className="flex items-center gap-2.5 text-xs font-extrabold tracking-wider uppercase text-white hover:text-white/90 py-2 transition-colors cursor-pointer"
              >
                <Menu className="w-4 h-4 stroke-[2.2]" />
                <span className="font-sans">ALL CATEGORIES</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Category Dropdown Menu */}
              {categoriesMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Browse Categories
                  </div>
                  {categories.map((c, idx) => (
                    <button
                      key={`nav-cat-menu-${c.id || idx}-${c.name}`}
                      onClick={() => {
                        onSelectCategory(c.name);
                        setActiveTab("shop");
                        setCategoriesMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 hover:text-[#1877f2] flex items-center gap-3 transition-colors"
                    >
                      {getCategoryIcon(c.name)}
                      <span className="capitalize">{c.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onSelectCategory("all");
                        setActiveTab("shop");
                        setCategoriesMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-[#1877f2] hover:bg-blue-50 flex items-center justify-between"
                    >
                      <span>View All Categories</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Center Menu Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-bold tracking-wider uppercase h-full">
              {/* HOME Tab */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-1.5 rounded-xl transition-all font-black text-xs tracking-wider ${
                  activeTab === "home"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                HOME
              </button>

              {/* SHOP ▾ with floating green NEW badge */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`relative px-4 py-2 transition-all flex items-center gap-1 font-bold ${
                    activeTab === "shop"
                      ? "text-white font-extrabold"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {/* Floating NEW badge */}
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#00e676] text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full font-sans leading-tight shadow-xs pointer-events-none">
                    NEW
                  </span>
                  <span>SHOP</span>
                  <ChevronDown className="w-3 h-3 text-white/70 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Shop Mega Hover Menu */}
                <div className="absolute top-full left-0 mt-0 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-50 animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      onSelectCategory("all");
                      setActiveTab("shop");
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium"
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory("Computer");
                      setActiveTab("shop");
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium"
                  >
                    Desktops & PCs
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory("Laptop");
                      setActiveTab("shop");
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium"
                  >
                    Laptops & MacBooks
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory("Mobile");
                      setActiveTab("shop");
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium"
                  >
                    Smartphones & Tablets
                  </button>
                </div>
              </div>

              {/* FEATURED ▾ with floating red SALE badge */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("shop");
                  }}
                  className="relative px-4 py-2 text-white/85 hover:text-white transition-all flex items-center gap-1 font-bold"
                >
                  {/* Floating SALE badge */}
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#ff2a5f] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full font-sans leading-tight shadow-xs pointer-events-none">
                    SALE
                  </span>
                  <span>FEATURED</span>
                  <ChevronDown className="w-3 h-3 text-white/70 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                <div className="absolute top-full left-0 mt-0 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-50 animate-in fade-in duration-100">
                  <button
                    onClick={() => setActiveTab("shop")}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium text-rose-600"
                  >
                    🔥 Today's Best Deals
                  </button>
                  <button
                    onClick={() => setActiveTab("shop")}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium"
                  >
                    ⭐ Top Rated Gear
                  </button>
                  <button
                    onClick={() => setActiveTab("shop")}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium"
                  >
                    📦 Weekly Clearance
                  </button>
                </div>
              </div>

              {/* BLOG ▾ */}
              <div className="relative group">
                <button
                  type="button"
                  className="px-4 py-2 text-white/85 hover:text-white transition-all flex items-center gap-1 font-bold"
                >
                  <span>BLOG</span>
                  <ChevronDown className="w-3 h-3 text-white/70 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-0 mt-0 w-44 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-50 animate-in fade-in duration-100">
                  <span className="block px-4 py-2 text-xs hover:bg-slate-50 font-medium cursor-pointer">
                    Tech News
                  </span>
                  <span className="block px-4 py-2 text-xs hover:bg-slate-50 font-medium cursor-pointer">
                    Buying Guides
                  </span>
                  <span className="block px-4 py-2 text-xs hover:bg-slate-50 font-medium cursor-pointer">
                    Reviews & Unboxing
                  </span>
                </div>
              </div>

              {/* ABOUT US */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("home");
                  window.scrollTo({ top: 600, behavior: "smooth" });
                }}
                className="px-4 py-2 text-white/85 hover:text-white transition-all font-bold"
              >
                ABOUT US
              </button>

              {/* CONTACT US */}
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                className="px-4 py-2 text-white/85 hover:text-white transition-all font-bold"
              >
                CONTACT US
              </button>
            </nav>

            {/* Right: Currency & Language Selectors */}
            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-white/90">
              {/* Language Selector with UK Flag */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {/* UK Flag SVG */}
                  <svg
                    className="w-4 h-3 rounded-xs shadow-xs"
                    viewBox="0 0 60 30"
                    fill="none"
                  >
                    <clipPath id="uk-flag">
                      <rect width="60" height="30" rx="1" />
                    </clipPath>
                    <g clipPath="url(#uk-flag)">
                      <rect width="60" height="30" fill="#012169" />
                      <path
                        d="M0 0L60 30M60 0L0 30"
                        stroke="#ffffff"
                        strokeWidth="6"
                      />
                      <path
                        d="M0 0L60 30M60 0L0 30"
                        stroke="#C8102E"
                        strokeWidth="4"
                      />
                      <path
                        d="M30 0V30M0 15H60"
                        stroke="#ffffff"
                        strokeWidth="10"
                      />
                      <path
                        d="M30 0V30M0 15H60"
                        stroke="#C8102E"
                        strokeWidth="6"
                      />
                    </g>
                  </svg>
                  <span>{selectedLang}</span>
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </button>

                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-28 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1 z-50">
                    {["ENG", "FRA", "GER", "KHM"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLang(lang);
                          setLangMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{selectedCurrency}</span>
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </button>

                {currencyMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-24 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1 z-50">
                    {["USD", "EUR", "GBP", "KHR"].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setSelectedCurrency(curr);
                          setCurrencyMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium"
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#00767c]/95 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("home");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-bold text-sm bg-white/10 text-white"
            >
              HOME
            </button>
            <button
              onClick={() => {
                setActiveTab("shop");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-bold text-sm text-white/90 hover:bg-white/10 flex items-center justify-between"
            >
              <span>SHOP</span>
              <span className="bg-[#00e676] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("shop");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-bold text-sm text-white/90 hover:bg-white/10 flex items-center justify-between"
            >
              <span>FEATURED</span>
              <span className="bg-[#ff2a5f] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                SALE
              </span>
            </button>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-lg font-bold text-sm text-[#00e676] hover:bg-white/10 block"
            >
              DASHBOARD
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center gap-2">
              <Headset className="w-4 h-4 text-white" />
              <span>+1 202 888 6789</span>
            </div>
            <div className="flex items-center gap-3">
              <span>🇬🇧 ENG</span>
              <span>USD</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
