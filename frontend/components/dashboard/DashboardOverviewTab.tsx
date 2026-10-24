"use client";

import React, { useState } from "react";
import {
  Eye,
  Users,
  MousePointerClick,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Plus,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ModernSelect } from "@/components/ui/select";

interface DashboardOverviewTabProps {
  onAddProduct: () => void;
  orderCount: number;
}

export function DashboardOverviewTab({
  onAddProduct,
  orderCount,
}: DashboardOverviewTabProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  // Chart data points
  const points = [
    { day: "1 Jan", val: 3200, label: "$3,200" },
    { day: "8 Jan", val: 8900, label: "$8,900" },
    { day: "15 Jan", val: 4600, label: "$4,600" },
    { day: "22 Jan", val: 14200, label: "$14,200" },
    { day: "29 Jan", val: 11000, label: "$11,000" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Page Header with Date Filter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time ecommerce store metrics, inventory alerts and revenue performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111827] text-xs font-medium text-slate-700 dark:text-zinc-300 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Jan 1, 2025 - Feb 1, 2025</span>
          </div>

          {/* Period selector */}
          <ModernSelect
            value={selectedPeriod}
            onChange={(val) => setSelectedPeriod(String(val))}
            size="sm"
            options={[
              { value: "Last 30 days", label: "Last 30 days" },
              { value: "Last 7 days", label: "Last 7 days" },
              { value: "This Month", label: "This Month" },
              { value: "This Quarter", label: "This Quarter" },
            ]}
          />

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 gap-1.5 text-slate-700 dark:text-zinc-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add widget</span>
          </Button>

          <Button
            size="sm"
            className="text-xs h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Page Views */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Page Views
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              34,850
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                15.5%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                vs. 14,653 last period
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Visitors */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Visitors
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              9,420
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                8.4%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                vs. 5,732 last period
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Click */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Click Through
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              4,120
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded-md">
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
                10.5%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                vs. 3,294 last period
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Orders */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              {orderCount || 46}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                4.4%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                vs. 1,186 last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Wave Curve Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  24.4%
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  vs. last period
                </span>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="p-5 pt-2">
            {/* SVG Interactive Wave Chart */}
            <div className="relative h-64 w-full">
              <svg
                viewBox="0 0 600 200"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal guidelines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="4 4" />
                <line x1="0" y1="70" x2="600" y2="70" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="4 4" />
                <line x1="0" y1="170" x2="600" y2="170" stroke="currentColor" strokeOpacity="0.1" />

                {/* Y-axis labels */}
                <text x="5" y="24" fill="currentColor" fillOpacity="0.4" fontSize="10" fontFamily="sans-serif">15K</text>
                <text x="5" y="74" fill="currentColor" fillOpacity="0.4" fontSize="10" fontFamily="sans-serif">10K</text>
                <text x="5" y="124" fill="currentColor" fillOpacity="0.4" fontSize="10" fontFamily="sans-serif">5K</text>
                <text x="5" y="174" fill="currentColor" fillOpacity="0.4" fontSize="10" fontFamily="sans-serif">0</text>

                {/* Area under curve */}
                <path
                  d="M 50 160 C 120 160, 160 120, 200 120 C 240 120, 270 155, 310 155 C 360 155, 400 30, 460 30 C 510 30, 540 165, 560 110 L 560 170 L 50 170 Z"
                  fill="url(#chartGradient)"
                />

                {/* Curved Line */}
                <path
                  d="M 50 160 C 120 160, 160 120, 200 120 C 240 120, 270 155, 310 155 C 360 155, 400 30, 460 30 C 510 30, 540 165, 560 110"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {[
                  { cx: 50, cy: 160, val: "$3.2k", day: "1 Jan" },
                  { cx: 200, cy: 120, val: "$8.9k", day: "8 Jan" },
                  { cx: 310, cy: 155, val: "$4.6k", day: "15 Jan" },
                  { cx: 460, cy: 30, val: "$14.2k", day: "22 Jan" },
                  { cx: 560, cy: 110, val: "$11.0k", day: "29 Jan" },
                ].map((pt, idx) => (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={pt.cx}
                      cy={pt.cy}
                      r={hoveredPoint === idx ? "7" : "5"}
                      className="fill-white dark:fill-[#111827] stroke-blue-600 stroke-[3px] transition-all"
                    />
                    {hoveredPoint === idx && (
                      <g>
                        <rect
                          x={pt.cx - 30}
                          y={pt.cy - 35}
                          width="60"
                          height="24"
                          rx="6"
                          className="fill-slate-900 dark:fill-white"
                        />
                        <text
                          x={pt.cx}
                          y={pt.cy - 19}
                          textAnchor="middle"
                          className="fill-white dark:fill-slate-900 font-bold text-[11px]"
                        >
                          {pt.val}
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* X-Axis Dates */}
            <div className="flex justify-between px-6 text-xs text-slate-400 dark:text-zinc-500 font-medium mt-1">
              <span>1 Jan</span>
              <span>8 Jan</span>
              <span>15 Jan</span>
              <span>22 Jan</span>
              <span>29 Jan</span>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Weekly Activity Bar Chart */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Weekly Sales Volume
            </span>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="p-5 pt-2 flex flex-col justify-end">
            <div className="h-44 flex items-end justify-between gap-2 px-2">
              {[
                { day: "Sun", height: "35%", active: false },
                { day: "Mon", height: "55%", active: false },
                { day: "Tue", height: "85%", active: true },
                { day: "Wed", height: "45%", active: false },
                { day: "Thu", height: "60%", active: false },
                { day: "Fri", height: "70%", active: false },
                { day: "Sat", height: "40%", active: false },
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 dark:bg-zinc-800/80 rounded-xl h-36 flex items-end p-1">
                    <div
                      style={{ height: b.height }}
                      className={`w-full rounded-lg transition-all duration-500 ${
                        b.active
                          ? "bg-blue-600 shadow-md shadow-blue-500/30"
                          : "bg-blue-200/70 dark:bg-blue-900/40 hover:bg-blue-300"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                    {b.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Customer Segments & Target Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Customer Segments</CardTitle>
              <CardDescription>
                Audience distribution and wholesale B2B accounts.
              </CardDescription>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-5 pt-3 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  Retailers
                </span>
                <div className="text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
                  2,884
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Distributors
                </span>
                <div className="text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
                  1,432
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  Wholesalers
                </span>
                <div className="text-lg font-bold text-slate-900 dark:text-zinc-100 mt-1">
                  562
                </div>
              </div>
            </div>

            {/* Segmented bar */}
            <div className="h-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="w-[58%] bg-blue-600 h-full" />
              <div className="w-[28%] bg-emerald-500 h-full" />
              <div className="w-[14%] bg-amber-500 h-full" />
            </div>
          </CardContent>
        </Card>

        {/* Target Completion Gauge */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Quarterly Target</CardTitle>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-5 pt-0 flex flex-col items-center justify-center text-center">
            {/* SVG Arc Gauge */}
            <div className="relative w-40 h-24 flex items-end justify-center">
              <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                {/* Background Track */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Active Arc (80%) */}
                <path
                  d="M 10 50 A 40 40 0 0 1 82 25"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mt-2">
              On track for 80% target
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 rounded-xl text-xs h-8 px-4"
            >
              Show details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
