"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Percent,
  Shield,
  Bell,
  Database,
  Save,
  Check,
  Plus,
  Trash2,
  Tag,
  DollarSign,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DiscountCode {
  id: string;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed Amount";
  amount: number;
  minSpend?: number;
  uses: number;
  status: "Active" | "Expired";
}

export function DashboardSettingsTab({ section }: { section: "settings" | "discounts" }) {
  const [saved, setSaved] = useState(false);
  const [storeName, setStoreName] = useState("DIGITAX PRO — Hardware & Electronics");
  const [currency, setCurrency] = useState("USD ($)");
  const [taxRate, setTaxRate] = useState("8.5");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("1000");

  const [discounts, setDiscounts] = useState<DiscountCode[]>([
    { id: "1", code: "HARDWARE10", discount: "10% OFF", type: "Percentage", amount: 10, minSpend: 100, uses: 48, status: "Active" },
    { id: "2", code: "RTXSUPER", discount: "$100 OFF", type: "Fixed Amount", amount: 100, minSpend: 800, uses: 22, status: "Active" },
    { id: "3", code: "BLACKFRIDAY", discount: "15% OFF", type: "Percentage", amount: 15, minSpend: 200, uses: 120, status: "Expired" },
  ]);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "Percentage" as "Percentage" | "Fixed Amount",
    amount: "10",
    minSpend: "100",
  });

  // Load from local storage
  useEffect(() => {
    try {
      const savedDiscounts = localStorage.getItem("techshop_coupons");
      if (savedDiscounts) setDiscounts(JSON.parse(savedDiscounts));

      const savedSettings = localStorage.getItem("techshop_store_settings");
      if (savedSettings) {
        const s = JSON.parse(savedSettings);
        if (s.storeName) setStoreName(s.storeName);
        if (s.currency) setCurrency(s.currency);
        if (s.taxRate) setTaxRate(s.taxRate);
        if (s.freeShippingThreshold) setFreeShippingThreshold(s.freeShippingThreshold);
      }
    } catch {}
  }, []);

  const handleSaveSettings = () => {
    const data = {
      storeName,
      currency,
      taxRate,
      freeShippingThreshold,
    };
    localStorage.setItem("techshop_store_settings", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;

    const amt = parseFloat(couponForm.amount) || 0;
    const formattedDiscount =
      couponForm.type === "Percentage" ? `${amt}% OFF` : `$${amt} OFF`;

    const newCode: DiscountCode = {
      id: `c-${Date.now()}`,
      code: couponForm.code.toUpperCase().trim(),
      discount: formattedDiscount,
      type: couponForm.type,
      amount: amt,
      minSpend: parseFloat(couponForm.minSpend) || 0,
      uses: 0,
      status: "Active",
    };

    const updated = [newCode, ...discounts];
    setDiscounts(updated);
    localStorage.setItem("techshop_coupons", JSON.stringify(updated));
    setIsCouponModalOpen(false);
    setCouponForm({ code: "", type: "Percentage", amount: "10", minSpend: "100" });
  };

  const handleDeleteCoupon = (id: string) => {
    const updated = discounts.filter((d) => d.id !== id);
    setDiscounts(updated);
    localStorage.setItem("techshop_coupons", JSON.stringify(updated));
  };

  const handleToggleCoupon = (id: string) => {
    const updated = discounts.map((d) =>
      d.id === id ? { ...d, status: d.status === "Active" ? ("Expired" as const) : ("Active" as const) } : d
    );
    setDiscounts(updated);
    localStorage.setItem("techshop_coupons", JSON.stringify(updated));
  };

  if (section === "discounts") {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Promotions & Discounts
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Create coupon codes, holiday promotional vouchers, and minimum spend rules.
            </p>
          </div>

          <Button
            onClick={() => setIsCouponModalOpen(true)}
            size="sm"
            className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {discounts.map((d) => (
            <Card key={d.id} className="p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base text-blue-600 dark:text-blue-400">
                    {d.code}
                  </span>
                  <button
                    onClick={() => handleToggleCoupon(d.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                      d.status === "Active"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-500"
                    }`}
                  >
                    {d.status}
                  </button>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-zinc-100">
                  {d.discount}
                </div>
                <div className="text-xs text-slate-400">
                  Min spend: <span className="font-semibold text-slate-700 dark:text-zinc-300">${d.minSpend || 0}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span>{d.uses} redeemed</span>
                <button
                  onClick={() => handleDeleteCoupon(d.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Coupon Modal */}
        <Dialog open={isCouponModalOpen} onOpenChange={setIsCouponModalOpen}>
          <DialogHeader onClose={() => setIsCouponModalOpen(false)}>
            <DialogTitle>Create Promotional Coupon Code</DialogTitle>
            <DialogDescription>
              Configure promotional discount percentage or fixed amount deduction.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCoupon} className="space-y-4 py-1 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Coupon Code * (e.g. SUMMER25)
              </label>
              <Input
                required
                value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                placeholder="PROMOCODE"
                className="font-mono text-xs uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                  Discount Type
                </label>
                <select
                  value={couponForm.type}
                  onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as any })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs outline-none"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed Amount">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                  Value ({couponForm.type === "Percentage" ? "%" : "$"})
                </label>
                <Input
                  required
                  type="number"
                  value={couponForm.amount}
                  onChange={(e) => setCouponForm({ ...couponForm, amount: e.target.value })}
                  placeholder="10"
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Minimum Spend Requirement ($)
              </label>
              <Input
                type="number"
                value={couponForm.minSpend}
                onChange={(e) => setCouponForm({ ...couponForm, minSpend: e.target.value })}
                placeholder="100"
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCouponModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white font-bold">
                Create Coupon
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
            Store Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Configure storefront branding, tax rates, currency, and Spring Boot API endpoints.
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Store Identity & Currency</CardTitle>
            <CardDescription>Public name displayed on emails and receipts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Store Name
              </label>
              <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Primary Currency
              </label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taxes & Shipping Thresholds</CardTitle>
            <CardDescription>Standard VAT and minimum spend for free shipping.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                VAT / Tax Rate (%)
              </label>
              <Input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Free Shipping Threshold ($)
              </label>
              <Input
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
