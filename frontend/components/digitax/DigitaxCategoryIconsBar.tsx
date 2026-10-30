"use client";

import React from "react";
import {
  Headphones,
  Camera,
  Monitor,
  Gamepad2,
  Laptop,
  Cpu,
  Smartphone,
  Watch,
} from "lucide-react";

interface CategoryIconsBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function DigitaxCategoryIconsBar({
  selectedCategory,
  onSelectCategory,
}: CategoryIconsBarProps) {
  const items = [
    { name: "Audio", icon: Headphones, label: "Audio" },
    { name: "Camera", icon: Camera, label: "Camera" },
    { name: "Computer", icon: Monitor, label: "Computer" },
    { name: "Game Console", icon: Gamepad2, label: "Gaming" },
    { name: "Laptop", icon: Laptop, label: "Laptop" },
    { name: "Memory", icon: Cpu, label: "Memory & CPU" },
    { name: "Mobile", icon: Smartphone, label: "Smartphones" },
    { name: "Smartwatch", icon: Watch, label: "Wearables" },
  ];

  return (
    <div className="w-full bg-slate-50/70 border-b border-slate-200/70 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isSelected =
              selectedCategory.toLowerCase() === item.name.toLowerCase();

            return (
              <button
                key={item.name}
                onClick={() => onSelectCategory(item.name)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 group cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-600 -translate-y-0.5"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110 ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100/80 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-bold tracking-tight text-center truncate w-full ${
                    isSelected ? "text-white" : "text-slate-800 group-hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

