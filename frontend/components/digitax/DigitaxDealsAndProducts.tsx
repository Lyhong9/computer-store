"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Star,
  ShoppingCart,
  Eye,
  Sparkles,
  Flame,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Product } from "@/types/store";
import { formatCurrency, normalizeImageUrl, handleImageError } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface DigitaxDealsAndProductsProps {
  products: Product[];
  onQuickView: (p: Product) => void;
  onViewAllClick: () => void;
}

export function DigitaxDealsAndProducts({
  products,
  onQuickView,
  onViewAllClick,
}: DigitaxDealsAndProductsProps) {
  const { addToCart } = useCart();

  // Urgent realistic countdown timer (ticks live)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Products for Spotlight Deals Row
  const gamerPc = products.find((p) => p.sku === "GAMER-XTREME-VR") || products[9] || products[0];
  const ipadPro = products.find((p) => p.sku === "IPAD-PRO-129-3") || products[0];
  const razerMouse = products.find((p) => p.sku === "RAZER-BASILISK-V3") || products[11] || products[1];
  const canonPixma = products.find((p) => p.sku === "CANON-PIXMA-AIO") || products[6] || products[2];

  // Bottom Products Grid (8 items for a clean 4-column layout)
  const bottomProducts = [
    products.find((p) => p.sku === "IPHONE-16-PRO-512") || products[2],
    products.find((p) => p.sku === "SEC-CAM-NIGHTVISION") || products[13],
    products.find((p) => p.sku === "SONY-WH-CH520") || products[12],
    products.find((p) => p.sku === "WATCH-S9-PINK") || products[4],
    products.find((p) => p.sku === "HP-DESKJET-WIRELESS") || products[10],
    products.find((p) => p.sku === "GALAXY-A15-5G") || products[8],
    products.find((p) => p.sku === "ASUS-CHROMEBOOK-14") || products[5],
    products.find((p) => p.sku === "IPHONE-14-PRO-256") || products[1],
  ].filter(Boolean) as Product[];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Deals Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-widest mb-2">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Limited Flash Specials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Today's Best Hardware Deals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Exclusive promotional prices with genuine warranty and instant Bakong KHQR checkout.
          </p>
        </div>

        <button
          onClick={onViewAllClick}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-blue-600 text-slate-800 dark:text-zinc-200 transition-all shadow-2xs group"
        >
          <span>View All Products</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2. Deals Spotlight 5-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
        {/* Deal Card 1: Gamer PC */}
        {gamerPc && (
          <ProductCardCompact
            product={gamerPc}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}

        {/* Deal Card 2: iPad Pro */}
        {ipadPro && (
          <ProductCardCompact
            product={ipadPro}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}

        {/* Centerpiece: Glowing Cyber Flash Deals Showcase Card */}
        <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-[#0c1222] via-[#0f172a] to-[#1e1b4b] p-6 sm:p-7 flex flex-col justify-between text-white shadow-2xl shadow-indigo-950/40 relative overflow-hidden group">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />

          {/* Top Urgent Header */}
          <div className="relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-rose-300 border border-rose-500/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>FLASH SALE • ENDS TODAY</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Today's Super Deals
            </h3>
            <p className="text-[11px] text-slate-300/90 font-medium mt-1 leading-relaxed">
              Limited promotional stock at subsidized clearance prices.
            </p>
          </div>

          {/* Center Digital Clock Countdown */}
          <div className="relative z-10 my-6">
            <div className="flex items-center justify-center gap-2 text-white">
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white font-black text-base flex items-center justify-center shadow-inner">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Hours
                </span>
              </div>
              <span className="font-black text-indigo-400 text-lg mb-4">:</span>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white font-black text-base flex items-center justify-center shadow-inner">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Mins
                </span>
              </div>
              <span className="font-black text-indigo-400 text-lg mb-4">:</span>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 border border-cyan-400/30 text-white font-black text-base flex items-center justify-center shadow-lg shadow-blue-500/30">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold text-cyan-300 mt-1 uppercase tracking-wider">
                  Secs
                </span>
              </div>
            </div>

            {/* Claimed Inventory Progress Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-amber-300">
                  <Zap className="w-3 h-3 fill-amber-300" />
                  <span>84% Claimed</span>
                </span>
                <span className="text-slate-400">Only 7 Units Left</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 shadow-sm"
                  style={{ width: "84%" }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10">
            <button
              onClick={onViewAllClick}
              className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Flash Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deal Card 3: Razer Mouse */}
        {razerMouse && (
          <ProductCardCompact
            product={razerMouse}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}

        {/* Deal Card 4: Canon Printer */}
        {canonPixma && (
          <ProductCardCompact
            product={canonPixma}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}
      </div>

      {/* 3. Bottom Products Grid (Featured Catalog) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Trending Gadgets & Creator Gear
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Free shipping in Phnom Penh on all hardware
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {bottomProducts.map((p, idx) => (
            <ProductCardCompact
              key={`deal-bottom-${p.id || 'p'}-${idx}-${p.sku || p.name || ''}`}
              product={p}
              onQuickView={onQuickView}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCardCompact({
  product,
  onQuickView,
  onAddToCart,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSale = product.badge === "SALE" || !!product.originalPrice;
  const isHot = product.badge === "HOT";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/90 dark:border-zinc-800 p-4 sm:p-4.5 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/60 dark:hover:border-blue-500/40 hover:-translate-y-1.5 transition-all duration-300 group relative">
      {/* Top Bar: Badge & Wishlist Button */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-1">
          {isHot && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" />
              <span>HOT</span>
            </span>
          )}
          {isSale && !isHot && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-xs uppercase tracking-wider">
              <Flame className="w-2.5 h-2.5 fill-white" />
              <span>SALE</span>
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[9px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md border border-rose-200/60 dark:border-rose-800/60">
              -99%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            isInWishlist(product.id)
              ? "bg-rose-50 dark:bg-rose-950/50 text-rose-500 scale-110 shadow-2xs"
              : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:scale-110"
          }`}
          title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isInWishlist(product.id) ? "fill-rose-500 text-rose-500 scale-110" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Image Stage - Cropped with Framed Border */}
      <div
        className="w-full h-52 sm:h-56 rounded-2xl border border-slate-200/90 dark:border-zinc-700/80 bg-slate-50 dark:bg-zinc-800/40 relative overflow-hidden cursor-pointer group-hover:border-blue-500/80 transition-all duration-300 shadow-2xs"
        onClick={() => onQuickView(product)}
      >
        <img
          src={normalizeImageUrl(product.primaryImage)}
          alt={product.name}
          onError={(e) => handleImageError(e)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-0 bottom-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md inline-block">
            {product.categoryName || "Hardware"}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            In Stock
          </span>
        </div>

        <h4
          onClick={() => onQuickView(product)}
          className="font-bold text-xs sm:text-sm text-slate-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 min-h-[36px] cursor-pointer transition-colors leading-snug"
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Star Rating with Score */}
        <div className="flex items-center gap-1.5 text-xs py-0.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-extrabold text-slate-800 dark:text-zinc-200 text-xs">
            {product.rating || "5.0"}
          </span>
          <span className="text-[10px] text-slate-400">
            ({product.soldCount || "48"} sold)
          </span>
        </div>

        {/* Price Row with Promo Tag */}
        <div className="pt-1 flex items-baseline gap-2 flex-wrap">
          <span className="font-black text-base text-rose-600 dark:text-rose-400 tracking-tight">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 ml-auto">
            KHQR Demo
          </span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        className="mt-3.5 w-full py-2.5 rounded-xl text-xs font-black bg-slate-900 dark:bg-zinc-800 hover:bg-blue-600 active:bg-blue-700 text-white transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md hover:shadow-blue-500/25 group/btn"
      >
        <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}
