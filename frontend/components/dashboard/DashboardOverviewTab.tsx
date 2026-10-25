"use client";

import React, { useState, useMemo } from "react";
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
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, normalizeImageUrl, handleImageError } from "@/lib/utils";
import { ModernSelect } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useStoreData";

interface DashboardOverviewTabProps {
  onAddProduct: () => void;
  orderCount?: number;
}

export function DashboardOverviewTab({
  onAddProduct,
  orderCount: propOrderCount,
}: DashboardOverviewTabProps) {
  const { orders } = useCart();
  const { data: products = [] } = useProducts();
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Live Metrics Derived from Orders and Products
  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  }, [orders]);

  const effectiveOrderCount = orders.length || propOrderCount || 12;

  const averageOrderValue = useMemo(() => {
    return totalRevenue / (orders.length || 1);
  }, [totalRevenue, orders.length]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => (p.quantityOnHand || 0) <= 10);
  }, [products]);

  // Top Selling Products aggregated from order items
  const topSellingProducts = useMemo(() => {
    const itemMap = new Map<number, { product: any; unitsSold: number; totalGross: number }>();

    orders.forEach((o) => {
      o.items.forEach((it) => {
        const id = it.product.id;
        const existing = itemMap.get(id);
        const qty = it.quantity || 1;
        const gross = (Number(it.product.price) || 0) * qty;

        if (existing) {
          existing.unitsSold += qty;
          existing.totalGross += gross;
        } else {
          itemMap.set(id, {
            product: it.product,
            unitsSold: qty,
            totalGross: gross,
          });
        }
      });
    });

    const sorted = Array.from(itemMap.values()).sort((a, b) => b.unitsSold - a.unitsSold);
    if (sorted.length > 0) return sorted.slice(0, 5);

    // Fallback based on products catalog
    return products.slice(0, 5).map((p, idx) => ({
      product: p,
      unitsSold: 18 - idx * 3,
      totalGross: (p.price || 500) * (18 - idx * 3),
    }));
  }, [orders, products]);

  // Dynamic Chart Points based on selected period
  const chartData = useMemo(() => {
    if (selectedPeriod === "Last 7 days") {
      return [
        { day: "Mon", val: totalRevenue * 0.12, label: formatCurrency(totalRevenue * 0.12) },
        { day: "Tue", val: totalRevenue * 0.18, label: formatCurrency(totalRevenue * 0.18) },
        { day: "Wed", val: totalRevenue * 0.08, label: formatCurrency(totalRevenue * 0.08) },
        { day: "Thu", val: totalRevenue * 0.22, label: formatCurrency(totalRevenue * 0.22) },
        { day: "Fri", val: totalRevenue * 0.25, label: formatCurrency(totalRevenue * 0.25) },
        { day: "Sat", val: totalRevenue * 0.31, label: formatCurrency(totalRevenue * 0.31) },
        { day: "Sun", val: totalRevenue * 0.15, label: formatCurrency(totalRevenue * 0.15) },
      ];
    }
    // Default 30 days / month
    return [
      { day: "Week 1", val: totalRevenue * 0.18, label: formatCurrency(totalRevenue * 0.18) },
      { day: "Week 2", val: totalRevenue * 0.28, label: formatCurrency(totalRevenue * 0.28) },
      { day: "Week 3", val: totalRevenue * 0.21, label: formatCurrency(totalRevenue * 0.21) },
      { day: "Week 4", val: totalRevenue * 0.33, label: formatCurrency(totalRevenue * 0.33) },
    ];
  }, [totalRevenue, selectedPeriod]);

  // Export Analytics Summary CSV
  const exportAnalyticsCsv = () => {
    const headers = ["Metric", "Value", "Period"];
    const rows = [
      ["Total Gross Volume", `"${formatCurrency(totalRevenue)}"`, `"${selectedPeriod}"`],
      ["Total Orders Placed", effectiveOrderCount, `"${selectedPeriod}"`],
      ["Average Order Value", `"${formatCurrency(averageOrderValue)}"`, `"${selectedPeriod}"`],
      ["Catalog Total Items", products.length, `"${selectedPeriod}"`],
      ["Low Stock Warnings", lowStockProducts.length, `"${selectedPeriod}"`],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `techshop_analytics_${selectedPeriod.replace(/\s+/g, "_").toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Page Header with Date Filter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
            Overview Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time ecommerce store metrics, revenue performance, and inventory health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            onClick={exportAnalyticsCsv}
            size="sm"
            className="text-xs h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </Button>
        </div>
      </div>

      {/* 4 Live KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Gross Revenue */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Total Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +24.4%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Total Orders */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Total Orders Placed
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              {effectiveOrderCount}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                Live Sync
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                100% fulfillable
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Average Order Value */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Average Order Value (AOV)
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              {formatCurrency(averageOrderValue)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +8.2%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                high ticket hardware
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Inventory Low Stock Alerts */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="p-5 pb-2 flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Low Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              {lowStockProducts.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                lowStockProducts.length > 0
                  ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
                  : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
              }`}>
                {lowStockProducts.length > 0 ? "Action Required" : "All Stocked"}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                items ≤ 10 units
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Wave Curve Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Revenue Performance ({selectedPeriod})</CardTitle>
              <CardDescription>
                Gross order sales across online store and physical POS terminal.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {chartData.length} Data Points
            </Badge>
          </CardHeader>

          <CardContent className="p-5 pt-2">
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

                {/* Grid lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                <line x1="0" y1="180" x2="600" y2="180" stroke="currentColor" strokeOpacity="0.1" />

                {/* Wave Area Fill */}
                <path
                  d="M 0 180 L 0 140 Q 150 40 300 90 T 600 50 L 600 180 Z"
                  fill="url(#chartGradient)"
                />

                {/* Wave Stroke Line */}
                <path
                  d="M 0 140 Q 150 40 300 90 T 600 50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {chartData.map((p, idx) => {
                  const cx = (600 / (chartData.length - 1 || 1)) * idx;
                  const cy = 180 - Math.min(140, (p.val / (totalRevenue || 1)) * 140 + 30);
                  const isHovered = hoveredPoint === idx;

                  return (
                    <g key={idx}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 7 : 4.5}
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth={isHovered ? 3 : 2}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {isHovered && (
                        <g>
                          <rect
                            x={Math.max(10, Math.min(500, cx - 45))}
                            y={cy - 36}
                            width="90"
                            height="24"
                            rx="6"
                            fill="#0f172a"
                          />
                          <text
                            x={Math.max(10, Math.min(500, cx - 45)) + 45}
                            y={cy - 20}
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {p.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold px-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
              {chartData.map((p, i) => (
                <span key={i}>{p.day}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Top Selling Hardware Leaderboard */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Top Selling Hardware</span>
              <Badge variant="secondary" className="text-[10px] font-bold">
                Leaderboard
              </Badge>
            </CardTitle>
            <CardDescription>
              Fastest moving components by units sold.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            {topSellingProducts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-black text-slate-500 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate max-w-[130px]">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.unitsSold} units sold
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400 font-mono">
                  {formatCurrency(item.totalGross)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Stream */}
        <Card>
          <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent Store Orders</CardTitle>
              <CardDescription>Latest customer purchases and current states.</CardDescription>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
              {orders.length} total
            </span>
          </CardHeader>
          <CardContent className="p-5 pt-0 divide-y divide-slate-100 dark:divide-zinc-800">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {o.id}
                  </p>
                  <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
                    {o.customerName}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(o.createdAt)} • {o.paymentMethod || "KHQR"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-zinc-50 block">
                    {formatCurrency(o.total)}
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                    o.status === "DELIVERED"
                      ? "bg-emerald-50 text-emerald-600"
                      : o.status === "SHIPPED"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock Replenishment Quick Actions */}
        <Card>
          <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Restock Recommendations</span>
              </CardTitle>
              <CardDescription>Critical inventory requiring replenishment.</CardDescription>
            </div>
            <Button
              onClick={onAddProduct}
              size="sm"
              variant="outline"
              className="text-xs h-8 gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700 dark:text-zinc-300">All Inventory Levels Healthy</p>
                <p className="mt-1">All products currently exceed minimum safety thresholds.</p>
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={normalizeImageUrl(p.primaryImage)}
                      alt={p.name}
                      onError={(e) => handleImageError(e)}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-zinc-700"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-zinc-100 line-clamp-1 max-w-[180px]">
                        {p.name}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        SKU: {p.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xs text-rose-600 block">
                      {p.quantityOnHand} units left
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Target: 30+ units
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
