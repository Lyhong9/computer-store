"use client";

import Link from "next/link";

interface HeroProps {
  onCategorySelect?: (categoryName: string) => void;
}

export function Hero({ onCategorySelect }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-zinc-800/80 bg-radial-[at_50%_0%] from-indigo-950/40 via-zinc-950 to-zinc-950">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-md shadow-inner shadow-indigo-500/20">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Official Authorized Computer & Hardware Store
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1] sm:leading-[1.1]">
            Uncompromising{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              Performance
            </span>{" "}
            & Precision Hardware.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Equip your creative and gaming battlespace with factory-sealed RTX 4090 GPUs, Apple M3 Max workstations, Ryzen 3D V-Cache processors, and esports monitors.
          </p>

          {/* Call to action & category pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onCategorySelect && onCategorySelect("Laptops")}
              id="hero-filter-laptops"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 group"
            >
              <span>Explore Laptops</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
            <button
              onClick={() => onCategorySelect && onCategorySelect("Graphics Cards")}
              id="hero-filter-gpus"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <span>GeForce RTX Series</span>
            </button>
            <button
              onClick={() => onCategorySelect && onCategorySelect("Processors")}
              id="hero-filter-cpus"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm transition-all"
            >
              <span>Desktop CPUs</span>
            </button>
          </div>

          {/* Highlights / Features Row */}
          <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-xl mb-1">🚀</div>
              <div className="text-xs font-bold text-zinc-200">24-Hour Dispatch</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Fast express delivery across nationwide hubs</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-xl mb-1">🛡️</div>
              <div className="text-xs font-bold text-zinc-200">3-Year Warranty</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Official manufacturer warranty on all components</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-xl mb-1">📦</div>
              <div className="text-xs font-bold text-zinc-200">Real-Time Inventory</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Spring Boot concurrency-safe stock reservation</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-xl mb-1">💳</div>
              <div className="text-xs font-bold text-zinc-200">Flexible Payments</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Cards, KHQR / ABA Pay, and Cash on Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
