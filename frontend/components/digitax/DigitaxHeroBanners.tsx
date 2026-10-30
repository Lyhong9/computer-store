"use client";

import React from "react";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Flame } from "lucide-react";

interface DigitaxHeroBannersProps {
  onShopClick: () => void;
}

export function DigitaxHeroBanners({ onShopClick }: DigitaxHeroBannersProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Large Main Hero Banner (Left 2 Columns) */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#070b16] via-[#0b1329] to-[#162044] text-white p-8 sm:p-12 min-h-[420px] sm:min-h-[450px] flex flex-col justify-between shadow-2xl border border-slate-800/80 group">
          {/* Luminous cyber gradient orbs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Text Content */}
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/15 border border-blue-400/30 text-blue-300 backdrop-blur-md uppercase tracking-wider mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span>Next-Gen Hardware 2026</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-5.5xl font-black tracking-tight text-white leading-[1.08] mb-4">
              ULTIMATE{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                PERFORMANCE
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mb-6">
              Experience extreme compute velocity. High-refresh OLEDs, flagship RTX 40-Series graphics, and ultra-responsive mechanical switches.
            </p>

            {/* Feature specs chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-cyan-200 border border-white/10">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> PCIe 5.0 Ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-blue-200 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> 3-Yr Warranty
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-emerald-200 border border-white/10">
                <Flame className="w-3.5 h-3.5 text-emerald-400" /> 4K 240Hz
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onShopClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onShopClick}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Special Offers</span>
            </button>
          </div>

          {/* Hero Hardware Image */}
          <div className="absolute right-0 sm:right-6 bottom-0 sm:bottom-4 w-60 sm:w-80 lg:w-96 h-60 sm:h-80 lg:h-96 pointer-events-none drop-shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl transform scale-75 group-hover:scale-90 transition-transform duration-700" />
            <img
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=900&q=80"
              alt="Ultimate Gaming Rig"
              className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* 2. Right Side Banners (2 stacked tiles) */}
        <div className="flex flex-col gap-6">
          {/* Top Tile: 4K Smart Camera */}
          <div className="relative rounded-3xl overflow-hidden bg-white p-6 sm:p-7 flex-1 min-h-[190px] flex items-center justify-between border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="max-w-[55%] z-10">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block mb-2">
                New Arrival
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                4K Xiaomi Smart Camera
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Night vision & 360° AI tracking</p>
              <button
                onClick={onShopClick}
                className="mt-3.5 text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 group/btn transition-colors cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-slate-200 dark:border-zinc-700/80 overflow-hidden relative shrink-0 bg-slate-50 dark:bg-zinc-800/40 shadow-2xs group-hover:border-blue-500/80 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"
                alt="4K Xiaomi Camera"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bottom Tile: Studio Spatial Audio */}
          <div className="relative rounded-3xl overflow-hidden bg-white p-6 sm:p-7 flex-1 min-h-[190px] flex items-center justify-between border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="max-w-[55%] z-10">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block mb-2">
                Top Bestseller
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Studio Spatial Audio
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Lossless wireless soundstage</p>
              <button
                onClick={onShopClick}
                className="mt-3.5 text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 group/btn transition-colors cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-slate-200 dark:border-zinc-700/80 overflow-hidden relative shrink-0 bg-slate-50 dark:bg-zinc-800/40 shadow-2xs group-hover:border-blue-500/80 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80"
                alt="Studio Spatial Audio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

