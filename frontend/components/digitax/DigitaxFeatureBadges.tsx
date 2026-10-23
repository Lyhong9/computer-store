"use client";

import React from "react";
import { Truck, RotateCcw, Headphones, Gift } from "lucide-react";

export function DigitaxFeatureBadges() {
  const features = [
    {
      title: "Free Shipping",
      desc: "on orders over $49.00",
      icon: Truck,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "7 Days Money Back",
      desc: "30 days money-back",
      icon: RotateCcw,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Online Support",
      desc: "support online 24h on day",
      icon: Headphones,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Gift Promotion",
      desc: "on orders over $99.00",
      icon: Gift,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${f.color}`}
              >
                <Icon className="w-6 h-6" />
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
