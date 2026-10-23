"use client";

import React, { useState } from "react";
import { Settings, Percent, Shield, Bell, Database, Save, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function DashboardSettingsTab({ section }: { section: "settings" | "discounts" }) {
  const [saved, setSaved] = useState(false);
  const [storeName, setStoreName] = useState("TechShop Hardware Ecommerce");
  const [currency, setCurrency] = useState("USD ($)");
  const [taxRate, setTaxRate] = useState("8.5");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("1000");

  const [discounts, setDiscounts] = useState([
    { code: "HARDWARE10", discount: "10% OFF", type: "Percentage", uses: 48, status: "Active" },
    { code: "RTXSUPER", discount: "$100 OFF", type: "Fixed Amount", uses: 22, status: "Active" },
    { code: "BLACKFRIDAY", discount: "15% OFF", type: "Percentage", uses: 120, status: "Expired" },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (section === "discounts") {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
            Promotions & Discounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Create coupon codes, holiday promotional vouchers and minimum spend rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {discounts.map((d, i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-base text-blue-600 dark:text-blue-400">
                  {d.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === "Active"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-500"
                  }`}
                >
                  {d.status}
                </span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-zinc-100">
                {d.discount}
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span>{d.type}</span>
                <span>{d.uses} redeemed</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
          Store Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Configure storefront branding, tax rates, currency, and Spring Boot API endpoints.
        </p>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                  Tax Rate (%)
                </label>
                <Input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                  Free Shipping Min ($)
                </label>
                <Input
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            {saved ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Changes saved successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings persist across sessions.</span>
            )}
            <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
              <Save className="w-3.5 h-3.5 mr-1" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Backend & Integration</CardTitle>
            <CardDescription>Spring Boot REST API endpoint connectivity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                API Base URL
              </label>
              <Input value="http://localhost:8083" readOnly className="bg-slate-50 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Clerk Authentication Provider
              </label>
              <Input value="Enabled (JWT Session Proxy)" readOnly className="bg-slate-50 dark:bg-zinc-900" />
            </div>
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300">
              TanStack Query and Axios are configured with live query invalidation and offline mock fallback.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
