"use client";

import React, { useState, useMemo } from "react";
import {
  Grid3X3,
  LayoutGrid,
  List,
  Star,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
  Filter,
  Check,
  ArrowRight,
  Search,
  X,
  Heart,
} from "lucide-react";
import { Product, Category, Brand } from "@/types/store";
import { formatCurrency, normalizeImageUrl, handleImageError } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface DigitaxShopViewProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onQuickView: (p: Product) => void;
  onHomeClick: () => void;
}

export function DigitaxShopView({
  products,
  categories,
  brands,
  selectedCategory,
  onSelectCategory,
  searchQuery = "",
  onSearchChange,
  onQuickView,
  onHomeClick,
}: DigitaxShopViewProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, totalWishlistItems } = useWishlist();

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wishlistOnly, setWishlistOnly] = useState<boolean>(false);

  const colors = [
    { name: "Blue", bg: "bg-blue-500" },
    { name: "Yellow", bg: "bg-amber-400" },
    { name: "Purple", bg: "bg-purple-500" },
    { name: "Black", bg: "bg-slate-900" },
  ];

  // Reset page when search or key filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, wishlistOnly]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    const q = searchQuery?.trim().toLowerCase() || "";
    return products
      .filter((p) => {
        // Wishlist Only filter
        if (wishlistOnly && !isInWishlist(p.id)) {
          return false;
        }

        // Search Query (name, description, sku, brand, category)
        if (q) {
          const nameMatch = p.name?.toLowerCase().includes(q);
          const descMatch = p.description?.toLowerCase().includes(q);
          const skuMatch = p.sku?.toLowerCase().includes(q);
          const brandMatch = p.brandName?.toLowerCase().includes(q);
          const catMatch = p.categoryName?.toLowerCase().includes(q);
          if (!nameMatch && !descMatch && !skuMatch && !brandMatch && !catMatch) {
            return false;
          }
        }

        // Category
        if (
          selectedCategory !== "all" &&
          p.categoryName?.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Brand
        if (
          selectedBrand !== "all" &&
          p.brandName?.toLowerCase() !== selectedBrand.toLowerCase()
        ) {
          return false;
        }

        // Price
        if (minPrice > 1 && p.price < minPrice) {
          return false;
        }
        if (p.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0; // default
      });
  }, [products, searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, wishlistOnly, isInWishlist]);

  const itemsPerPage = 12;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50 duration-300">
      {/* Title & Breadcrumbs */}
      <div className="text-center py-6 border-b border-slate-100 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Products
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2 font-medium">
          <button onClick={onHomeClick} className="hover:text-blue-600">
            Home
          </button>
          <span>&gt;</span>
          <span className="text-slate-800 font-bold">Products</span>
          {selectedCategory !== "all" && (
            <>
              <span>&gt;</span>
              <span className="text-blue-600 font-bold capitalize">
                {selectedCategory}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ============================================================ */}
        {/* Left Filter Sidebar                                           */}
        {/* ============================================================ */}
        <div className="space-y-8">
          {/* Wishlist Quick Filter Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
            <button
              type="button"
              onClick={() => setWishlistOnly((prev) => !prev)}
              className={`w-full py-2.5 px-3 rounded-xl transition-all font-bold flex items-center justify-between text-xs cursor-pointer ${
                wishlistOnly
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                  : "bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200/70"
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${wishlistOnly ? "fill-white text-white" : "text-rose-500"}`} />
                <span>My Wishlist</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                wishlistOnly ? "bg-white text-rose-600" : "bg-rose-100 text-rose-600"
              }`}>
                {totalWishlistItems}
              </span>
            </button>
          </div>

          {/* 1. Categories List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Categories
            </h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => onSelectCategory("all")}
                className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors font-medium flex items-center justify-between ${
                  selectedCategory === "all"
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                <span>All Products</span>
                <span className="text-[11px] text-slate-400">({products.length})</span>
              </button>
              {categories.map((c, idx) => {
                const count = products.filter(
                  (p) => p.categoryName?.toLowerCase() === c.name.toLowerCase()
                ).length;
                const isSelected =
                  selectedCategory.toLowerCase() === c.name.toLowerCase();

                return (
                  <button
                    key={`cat-${c.id || idx}-${c.name || idx}`}
                    onClick={() => onSelectCategory(c.name)}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors font-medium flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.icon || "💻"}</span>
                      <span>{c.name}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Price Range Slider */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Price Range
            </h3>
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="10000"
                step="10"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>$1</span>
                <span className="text-blue-600 font-extrabold text-sm">${maxPrice}</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="w-full py-1.5 bg-[#1b74e4] hover:bg-[#155ec2] text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-colors shadow-xs"
              >
                Filter
              </button>
            </div>
          </div>

          {/* 3. Color Filter Swatches */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Color
            </h3>
            <div className="flex items-center gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() =>
                    setSelectedColor(selectedColor === c.name ? null : c.name)
                  }
                  className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-transform hover:scale-110 shadow-xs ${
                    selectedColor === c.name ? "ring-2 ring-offset-2 ring-blue-600" : ""
                  }`}
                  title={c.name}
                >
                  {selectedColor === c.name && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Brands Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Brands
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-blue-600 font-medium">
                <input
                  type="radio"
                  name="brand-filter"
                  checked={selectedBrand === "all"}
                  onChange={() => setSelectedBrand("all")}
                  className="accent-blue-600"
                />
                <span>All Brands</span>
              </label>
              {brands.map((b, idx) => (
                <label
                  key={`brand-${b.id || idx}-${b.name || idx}`}
                  className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-blue-600 font-medium"
                >
                  <input
                    type="radio"
                    name="brand-filter"
                    checked={selectedBrand.toLowerCase() === b.name.toLowerCase()}
                    onChange={() => setSelectedBrand(b.name)}
                    className="accent-blue-600"
                  />
                  <span>{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Airpod Pro 2 Promo Banner (Pink Card) */}
          <div className="rounded-3xl bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 text-white p-6 shadow-xl relative overflow-hidden text-center">
            <div className="relative z-10">
              <h4 className="text-xl font-black tracking-tight mb-1">
                AirPod Pro 2
              </h4>
              <p className="text-[11px] text-pink-100 font-medium mb-4 leading-snug">
                Next-generation active noise cancellation from Apple
              </p>
              <div className="w-32 h-32 mx-auto mb-3">
                <img
                  src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80"
                  alt="AirPod Pro"
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
              <button
                onClick={() => onSelectCategory("Audio")}
                className="px-5 py-2 rounded-full text-xs font-black bg-white text-rose-600 hover:bg-pink-50 transition-all uppercase tracking-wider shadow-md"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Right Main Catalog Content                                   */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* View Grid Switchers & Active Results */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  gridCols === 3
                    ? "bg-slate-100 border-slate-300 text-blue-600 shadow-2xs"
                    : "border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
                title="3 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  gridCols === 4
                    ? "bg-slate-100 border-slate-300 text-blue-600 shadow-2xs"
                    : "border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
                title="4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 font-medium ml-1">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
              </span>

              {searchQuery && (
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200/80 font-semibold ml-2">
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => onSearchChange?.("")}
                    className="p-0.5 hover:bg-blue-200/60 rounded-full transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Modern Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 font-bold text-slate-800 outline-none cursor-pointer text-xs transition-colors"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Average Rating</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Cards Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs my-4 animate-in fade-in-50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-blue-500">
                <Search className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5">
                No products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                {wishlistOnly
                  ? "You haven't saved any products to your wishlist yet. Click the heart icon on any product to save it here!"
                  : searchQuery
                  ? `We couldn't find any products matching "${searchQuery}". Check your spelling or try another keyword.`
                  : "No products match the selected filters."}
              </p>
              <div className="flex items-center justify-center gap-3">
                {wishlistOnly && (
                  <button
                    onClick={() => setWishlistOnly(false)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Show All Products
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange?.("")}
                    className="px-4 py-2 bg-[#1b74e4] hover:bg-[#155ec2] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => {
                    onSearchChange?.("");
                    onSelectCategory("all");
                    setSelectedBrand("all");
                    setMaxPrice(10000);
                    setWishlistOnly(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-5 ${
                gridCols === 4
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
            {paginatedProducts.map((p, idx) => (
              <div
                key={`shop-prod-${p.id || 'p'}-${idx}-${p.sku || p.name || ''}`}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group relative"
              >
                {/* Header: Badges & Wishlist Button */}
                <div className="flex items-center justify-between mb-2 z-10">
                  <div className="flex gap-1">
                    {p.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          p.badge === "HOT"
                            ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p);
                    }}
                    title={isInWishlist(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isInWishlist(p.id)
                        ? "bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100"
                        : "bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 border border-slate-200/60"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform ${
                        isInWishlist(p.id) ? "fill-rose-500 text-rose-500 scale-110" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Product Image - Cropped with Framed Border */}
                <div
                  className="w-full h-52 sm:h-56 rounded-2xl border border-slate-200/90 dark:border-zinc-700/80 overflow-hidden bg-slate-50 dark:bg-zinc-800/40 cursor-pointer group-hover:border-blue-500/80 transition-all duration-300 relative shadow-2xs"
                  onClick={() => onQuickView(p)}
                >
                  <img
                    src={normalizeImageUrl(p.primaryImage)}
                    alt={p.name}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {p.categoryName || "Hardware"}
                  </span>
                  <h4
                    onClick={() => onQuickView(p)}
                    className="font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 line-clamp-2 min-h-[38px] cursor-pointer"
                  >
                    {p.name}
                  </h4>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-amber-400 py-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-black text-sm sm:text-base text-rose-600">
                      {formatCurrency(p.price)}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => addToCart(p)}
                  className="mt-3.5 w-full py-2 rounded-xl text-xs font-bold bg-[#1b74e4] hover:bg-[#155ec2] text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add To Cart</span>
                </button>
              </div>
            ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={`page-btn-${i}`}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-[#1b74e4] text-white shadow-md shadow-blue-500/25"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center justify-center"
                >
                  →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
