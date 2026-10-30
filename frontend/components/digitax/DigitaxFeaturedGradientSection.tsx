"use client";

import React from "react";
import { Star, ShoppingCart, Eye, Heart, Sparkles, Flame, Award } from "lucide-react";
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
  const hpLaptop = products.find((p) => p.sku === "HP-DESKJET-WIRELESS") || products[10] || products[4];
  const sonyHeadphone = products.find((p) => p.sku === "SONY-WH-CH520") || products[12] || products[5];
  const canonPrinter = products.find((p) => p.sku === "CANON-PIXMA-AIO") || products[6] || products[6];
  const secCamera = products.find((p) => p.sku === "SEC-CAM-NIGHTVISION") || products[13] || products[7];

  return (
    <div className="w-full bg-gradient-to-br from-[#060a15] via-[#0a1124] to-[#121c3b] py-14 my-10 shadow-2xl border-y border-slate-800/80 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/4 -mt-20 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-20 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 backdrop-blur-md uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Curated Flagships</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Flagship Hardware Spotlight
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Hand-picked performance devices with genuine local warranty and instant Bakong KHQR checkout.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Featured Products */}
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 backdrop-blur-xl flex flex-col justify-between group hover:border-slate-700/80 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Featured Hardware
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pro Grade
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Spotlight Product Left */}
              {iphone15 && (
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-800/80 sm:pr-6 pb-6 sm:pb-0">
                  <div
                    className="w-full h-52 sm:h-56 relative mb-4 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-950/60 border border-slate-800 flex items-center justify-center p-4 cursor-pointer group/img overflow-hidden"
                    onClick={() => onQuickView(iphone15)}
                  >
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider shadow-sm">
                        SPOTLIGHT
                      </span>
                    </div>
                    <img
                      src={normalizeImageUrl(iphone15.primaryImage)}
                      alt={iphone15.name}
                      onError={(e) => handleImageError(e)}
                      className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-500 drop-shadow-xl"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    {iphone15.categoryName || "Mobile"}
                  </span>
                  <h4
                    onClick={() => onQuickView(iphone15)}
                    className="font-black text-sm sm:text-base text-white hover:text-cyan-300 cursor-pointer line-clamp-2 transition-colors"
                  >
                    {iphone15.name}
                  </h4>
                  <div className="flex items-center gap-1 my-2 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-lg text-cyan-400">
                      {formatCurrency(iphone15.price)}
                    </span>
                    {iphone15.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatCurrency(iphone15.originalPrice)}
                      </span>
                    )}
                    <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                      KHQR Promo
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2.5 w-full">
                    <button
                      onClick={() => addToCart(iphone15)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add To Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(iphone15)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isInWishlist(iphone15.id)
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                          : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-rose-400 hover:border-slate-600"
                      }`}
                      title={isInWishlist(iphone15.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(iphone15.id) ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Compact 3 items list Right */}
              <div className="space-y-3">
                {[ultraS23, galaxyA54, razerMouse].map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-800/70 border border-transparent hover:border-slate-800 transition-all group"
                  >
                    <div
                      className="w-16 h-16 rounded-xl bg-slate-950/70 border border-slate-800/90 p-1.5 shrink-0 cursor-pointer flex items-center justify-center"
                      onClick={() => onQuickView(p)}
                    >
                      <img
                        src={normalizeImageUrl(p.primaryImage)}
                        alt={p.name}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
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
                        className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate cursor-pointer transition-colors"
                      >
                        {p.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-cyan-400">
                          {formatCurrency(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through">
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
                          ? "text-rose-400 bg-rose-500/20 scale-110"
                          : "text-slate-500 hover:text-rose-400 hover:bg-slate-800"
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
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 backdrop-blur-xl flex flex-col justify-between group hover:border-slate-700/80 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Best-Selling Flagships
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Top Rated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Spotlight Product Left */}
              {hpLaptop && (
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-800/80 sm:pr-6 pb-6 sm:pb-0">
                  <div
                    className="w-full h-52 sm:h-56 relative mb-4 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-950/60 border border-slate-800 flex items-center justify-center p-4 cursor-pointer group/img overflow-hidden"
                    onClick={() => onQuickView(hpLaptop)}
                  >
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider shadow-sm">
                        TOP SELLER
                      </span>
                    </div>
                    <img
                      src={normalizeImageUrl(hpLaptop.primaryImage)}
                      alt={hpLaptop.name}
                      onError={(e) => handleImageError(e)}
                      className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-500 drop-shadow-xl"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    {hpLaptop.categoryName || "Laptop"}
                  </span>
                  <h4
                    onClick={() => onQuickView(hpLaptop)}
                    className="font-black text-sm sm:text-base text-white hover:text-cyan-300 cursor-pointer line-clamp-2 transition-colors"
                  >
                    {hpLaptop.name}
                  </h4>
                  <div className="flex items-center gap-1 my-2 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-lg text-cyan-400">
                      {formatCurrency(hpLaptop.price)}
                    </span>
                    {hpLaptop.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatCurrency(hpLaptop.originalPrice)}
                      </span>
                    )}
                    <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                      KHQR Promo
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2.5 w-full">
                    <button
                      onClick={() => addToCart(hpLaptop)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add To Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(hpLaptop)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isInWishlist(hpLaptop.id)
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                          : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-rose-400 hover:border-slate-600"
                      }`}
                      title={isInWishlist(hpLaptop.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(hpLaptop.id) ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Compact 3 items list Right */}
              <div className="space-y-3">
                {[sonyHeadphone, canonPrinter, secCamera].map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-800/70 border border-transparent hover:border-slate-800 transition-all group"
                  >
                    <div
                      className="w-16 h-16 rounded-xl bg-slate-950/70 border border-slate-800/90 p-1.5 shrink-0 cursor-pointer flex items-center justify-center"
                      onClick={() => onQuickView(p)}
                    >
                      <img
                        src={normalizeImageUrl(p.primaryImage)}
                        alt={p.name}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
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
                        className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate cursor-pointer transition-colors"
                      >
                        {p.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-cyan-400">
                          {formatCurrency(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through">
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
                          ? "text-rose-400 bg-rose-500/20 scale-110"
                          : "text-slate-500 hover:text-rose-400 hover:bg-slate-800"
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

