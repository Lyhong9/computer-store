"use client";

import React from "react";
import { Truck, ShieldCheck, Headphones, QrCode } from "lucide-react";

export function DigitaxFeatureBadges() {
  const features = [
    {
      title: "Fast Local Delivery",
      desc: "Phnom Penh & 24 Provinces",
      icon: Truck,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Bakong KHQR Instant Pay",
      desc: "Zero fees with any banking app",
      icon: QrCode,
      color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Official 3-Yr Warranty",
      desc: "100% genuine guaranteed parts",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Tech Support 24/7",
      desc: "Dedicated hardware specialist",
      icon: Headphones,
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${f.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                  {f.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

