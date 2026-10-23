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
  Tablet,
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
    { name: "Audio", icon: Headphones },
    { name: "Camera", icon: Camera },
    { name: "Computer", icon: Monitor },
    { name: "Game Console", icon: Gamepad2 },
    { name: "Laptop", icon: Laptop },
    { name: "Memory", icon: Cpu },
    { name: "Mobile", icon: Smartphone },
    { name: "Smartwatch", icon: Watch },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-100 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isSelected =
              selectedCategory.toLowerCase() === item.name.toLowerCase();

            return (
              <button
                key={item.name}
                onClick={() => onSelectCategory(item.name)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 group ${
                  isSelected
                    ? "bg-blue-50 border-2 border-blue-600 shadow-sm"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold tracking-tight text-center ${
                    isSelected
                      ? "text-blue-600"
                      : "text-slate-700 group-hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
