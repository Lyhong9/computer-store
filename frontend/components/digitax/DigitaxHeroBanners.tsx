"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface DigitaxHeroBannersProps {
  onShopClick: () => void;
}

export function DigitaxHeroBanners({ onShopClick }: DigitaxHeroBannersProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Large Main Hero Banner (Left 2 Columns) */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-tr from-[#990a2a] via-[#c9184a] to-[#ff4d6d] text-white p-8 sm:p-12 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between shadow-xl">
          {/* Background decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-black/10 blur-xl pointer-events-none" />

          {/* Text Content */}
          <div className="relative z-10 max-w-md">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md uppercase tracking-widest mb-3">
              New Arrivals
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-widest uppercase drop-shadow-md leading-none mb-4">
              U L T I M A T E
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 font-medium leading-relaxed max-w-sm">
              Discover cutting-edge audio systems, next-gen hardware, and premium wireless sound.
            </p>
          </div>

          {/* Action button */}
          <div className="relative z-10 mt-6">
            <button
              onClick={onShopClick}
              className="px-6 py-3 rounded-full bg-white text-slate-900 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/20 flex items-center gap-2"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Hardware Image */}
          <div className="absolute right-4 sm:right-12 bottom-4 sm:bottom-8 w-48 sm:w-72 h-48 sm:h-72 pointer-events-none drop-shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
              alt="Ultimate Hardware"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] rotate-[-6deg] hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>

        {/* 2. Right Side Banners (2 stacked tiles) */}
        <div className="flex flex-col gap-6">
          {/* Top Tile: 4K Xiaomi Camera */}
          <div className="relative rounded-3xl overflow-hidden bg-[#f7f5ef] p-6 sm:p-7 flex-1 min-h-[180px] flex items-center justify-between border border-slate-200/60 shadow-md group">
            <div className="max-w-[55%] z-10">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
                New Arrivals
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                4K Xiaomi Camera
              </h3>
              <button
                onClick={onShopClick}
                className="mt-3 text-xs font-bold text-slate-800 underline underline-offset-4 hover:text-blue-600 flex items-center gap-1"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-32 h-32 sm:w-36 sm:h-36 relative">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"
                alt="4K Xiaomi Camera"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
              />
            </div>
          </div>

          {/* Bottom Tile: Bluetooth Speaker */}
          <div className="relative rounded-3xl overflow-hidden bg-[#eef4f8] p-6 sm:p-7 flex-1 min-h-[180px] flex items-center justify-between border border-slate-200/60 shadow-md group">
            <div className="max-w-[55%] z-10">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                Bestsellers
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Bluetooth Speaker
              </h3>
              <button
                onClick={onShopClick}
                className="mt-3 text-xs font-bold text-slate-800 underline underline-offset-4 hover:text-blue-600 flex items-center gap-1"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-32 h-32 sm:w-36 sm:h-36 relative">
              <img
                src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80"
                alt="Bluetooth Speaker"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
