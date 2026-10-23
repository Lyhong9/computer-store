"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { Product } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

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

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 359,
    hours: 16,
    minutes: 9,
    seconds: 38,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Products for Deals Row
  const canonPixma = products.find((p) => p.sku === "CANON-PIXMA-AIO") || products[6];
  const gamerPc = products.find((p) => p.sku === "GAMER-XTREME-VR") || products[9];
  const razerMouse = products.find((p) => p.sku === "RAZER-BASILISK-V3") || products[11];
  const ipadPro = products.find((p) => p.sku === "IPAD-PRO-129-3") || products[0];

  // Bottom 6 Products
  const bottomProducts = [
    products.find((p) => p.sku === "IPHONE-16-PRO-512") || products[2],
    products.find((p) => p.sku === "SEC-CAM-NIGHTVISION") || products[13],
    products.find((p) => p.sku === "SONY-WH-CH520") || products[12],
    products.find((p) => p.sku === "WATCH-S9-PINK") || products[4],
    products.find((p) => p.sku === "HP-DESKJET-WIRELESS") || products[10],
    products.find((p) => p.sku === "GALAXY-A15-5G") || products[8],
  ].filter(Boolean) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Deals Spotlight Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
        {/* Deal Item 1 */}
        {canonPixma && (
          <ProductCardCompact
            product={canonPixma}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}

        {/* Deal Item 2 */}
        {gamerPc && (
          <ProductCardCompact
            product={gamerPc}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}

        {/* Center Countdown Spotlight Card */}
        <div className="rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50/40 p-6 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-1">
            Special Offers
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">
            Today's Best Deals
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mb-4 max-w-[200px]">
            Limited quantities at exclusive wholesale discounts.
          </p>

          {/* Countdown Boxes */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/25">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Days</span>
            </div>
            <span className="font-bold text-blue-600 mb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/25">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Hours</span>
            </div>
            <span className="font-bold text-blue-600 mb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/25">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Mins</span>
            </div>
            <span className="font-bold text-blue-600 mb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/25">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Secs</span>
            </div>
          </div>

          <button
            onClick={onViewAllClick}
            className="px-6 py-2.5 rounded-full text-xs font-black bg-white border border-slate-200 text-slate-900 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all shadow-xs uppercase tracking-wider"
          >
            View All
          </button>
        </div>

        {/* Deal Item 3 */}
        {razerMouse && (
          <ProductCardCompact
            product={razerMouse}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}

        {/* Deal Item 4 */}
        {ipadPro && (
          <ProductCardCompact
            product={ipadPro}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        )}
      </div>

      {/* 2. Bottom 6 Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {bottomProducts.map((p, idx) => (
          <ProductCardCompact
            key={`${p.id}-${p.sku || idx}`}
            product={p}
            onQuickView={onQuickView}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
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
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group relative">
      {/* Badge Top Left */}
      <div className="flex gap-1 mb-2 z-10">
        {product.badge && (
          <span
            className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
              product.badge === "HOT"
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div
        className="w-full h-36 flex items-center justify-center p-2 cursor-pointer group-hover:scale-105 transition-transform"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.primaryImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-sm"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
          {product.categoryName || "Hardware"}
        </span>
        <h4
          onClick={() => onQuickView(product)}
          className="font-bold text-xs text-slate-800 hover:text-blue-600 line-clamp-2 min-h-[32px] cursor-pointer"
        >
          {product.name}
        </h4>

        {/* 5 Star Rating */}
        <div className="flex items-center gap-1 text-amber-400 py-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" />
          ))}
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-black text-sm text-rose-600">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => onAddToCart(product)}
        className="mt-3 w-full py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors flex items-center justify-center gap-1.5"
      >
        <ShoppingCart className="w-3 h-3" />
        <span>Add</span>
      </button>
    </div>
  );
}
