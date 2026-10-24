"use client";

import React from "react";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { Product } from "@/types/store";
import { formatCurrency, normalizeImageUrl, handleImageError } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface DigitaxFeaturedGradientSectionProps {
  products: Product[];
  onQuickView: (p: Product) => void;
}

export function DigitaxFeaturedGradientSection({
  products,
  onQuickView,
}: DigitaxFeaturedGradientSectionProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Find products for Featured Card
  const iphone15 = products.find((p) => p.sku === "IPHONE-15-PRO-TITAN") || products[3] || products[0];
  const ultraS23 = products.find((p) => p.sku === "ULTRA-S23-5G") || products[14] || products[1];
  const galaxyA54 = products.find((p) => p.sku === "GALAXY-A54-5G") || products[7] || products[2];
  const razerMouse = products.find((p) => p.sku === "RAZER-BASILISK-V3") || products[11] || products[3];

  // Find products for Best-Selling Card
  const hpPrinter = products.find((p) => p.sku === "HP-DESKJET-WIRELESS") || products[10] || products[4];
  const sonyHeadphone = products.find((p) => p.sku === "SONY-WH-CH520") || products[12] || products[5];
  const canonPrinter = products.find((p) => p.sku === "CANON-PIXMA-AIO") || products[6] || products[6];
  const secCamera = products.find((p) => p.sku === "SEC-CAM-NIGHTVISION") || products[13] || products[7];

  return (
    <div className="w-full bg-gradient-to-r from-[#006466] via-[#065a82] to-[#14213d] py-10 my-6 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Featured Products */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 tracking-tight">
              Featured Products
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Spotlight Product Left */}
              {iphone15 && (
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-100 sm:pr-6 pb-6 sm:pb-0">
                  <div className="w-48 h-56 relative mb-4 cursor-pointer group" onClick={() => onQuickView(iphone15)}>
                    <img
                      src={normalizeImageUrl(iphone15.primaryImage)}
                      alt={iphone15.name}
                      onError={(e) => handleImageError(e)}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                    {iphone15.categoryName || "Mobile"}
                  </span>
                  <h4
                    onClick={() => onQuickView(iphone15)}
                    className="font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                  >
                    {iphone15.name}
                  </h4>
                  <div className="flex items-center gap-1 my-1.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <div className="font-black text-base text-slate-900 mt-1">
                    {formatCurrency(iphone15.price)}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(iphone15)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b74e4] hover:bg-[#155ec2] text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add To Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(iphone15)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isInWishlist(iphone15.id)
                          ? "bg-rose-50 text-rose-500 border-rose-200 shadow-xs"
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:text-rose-500 hover:bg-rose-50"
                      }`}
                      title={isInWishlist(iphone15.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(iphone15.id) ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Compact 3 items list Right */}
              <div className="space-y-4">
                {[ultraS23, galaxyA54, razerMouse].map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div
                      className="w-16 h-16 rounded-xl bg-slate-50 p-1 shrink-0 cursor-pointer"
                      onClick={() => onQuickView(p)}
                    >
                      <img
                        src={normalizeImageUrl(p.primaryImage)}
                        alt={p.name}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {p.badge && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                            p.badge === "HOT" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                          }`}>
                            {p.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {p.categoryName}
                        </span>
                      </div>
                      <h5
                        onClick={() => onQuickView(p)}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 truncate cursor-pointer"
                      >
                        {p.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-blue-600">
                          {formatCurrency(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                        isInWishlist(p.id)
                          ? "text-rose-500 bg-rose-50 scale-110"
                          : "text-slate-300 hover:text-rose-500 hover:bg-slate-100 opacity-60 group-hover:opacity-100"
                      }`}
                      title={isInWishlist(p.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(p.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Best-Selling Products */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 tracking-tight">
              Best-Selling Products
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Spotlight Product Left */}
              {hpPrinter && (
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-100 sm:pr-6 pb-6 sm:pb-0">
                  <div className="w-48 h-56 relative mb-4 cursor-pointer group" onClick={() => onQuickView(hpPrinter)}>
                    <div className="absolute top-0 left-0 flex gap-1 z-10">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500 text-white uppercase">
                        SALE
                      </span>
                    </div>
                    <img
                      src={normalizeImageUrl(hpPrinter.primaryImage)}
                      alt={hpPrinter.name}
                      onError={(e) => handleImageError(e)}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                    {hpPrinter.categoryName || "Computer"}
                  </span>
                  <h4
                    onClick={() => onQuickView(hpPrinter)}
                    className="font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                  >
                    {hpPrinter.name}
                  </h4>
                  <div className="flex items-center gap-1 my-1.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-base text-rose-600">
                      {formatCurrency(hpPrinter.price)}
                    </span>
                    {hpPrinter.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(hpPrinter.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(hpPrinter)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b74e4] hover:bg-[#155ec2] text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add To Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(hpPrinter)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isInWishlist(hpPrinter.id)
                          ? "bg-rose-50 text-rose-500 border-rose-200 shadow-xs"
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:text-rose-500 hover:bg-rose-50"
                      }`}
                      title={isInWishlist(hpPrinter.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(hpPrinter.id) ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Compact 3 items list Right */}
              <div className="space-y-4">
                {[sonyHeadphone, canonPrinter, secCamera].map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div
                      className="w-16 h-16 rounded-xl bg-slate-50 p-1 shrink-0 cursor-pointer"
                      onClick={() => onQuickView(p)}
                    >
                      <img
                        src={normalizeImageUrl(p.primaryImage)}
                        alt={p.name}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500 text-white uppercase">
                          SALE
                        </span>
                        {p.badge === "HOT" && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500 text-white uppercase">
                            HOT
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {p.categoryName}
                        </span>
                      </div>
                      <h5
                        onClick={() => onQuickView(p)}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 truncate cursor-pointer"
                      >
                        {p.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-blue-600">
                          {formatCurrency(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                        isInWishlist(p.id)
                          ? "text-rose-500 bg-rose-50 scale-110"
                          : "text-slate-300 hover:text-rose-500 hover:bg-slate-100 opacity-60 group-hover:opacity-100"
                      }`}
                      title={isInWishlist(p.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(p.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
