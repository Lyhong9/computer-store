"use client";

import React, { useMemo } from "react";
import {
  Receipt,
  CreditCard,
  BarChart3,
  FileText,
  Download,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  PieChart,
  CheckCircle2,
  QrCode,
  Wallet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface DashboardFinancesTabProps {
  type: "invoices" | "transactions" | "reports" | "analytics";
}

export function DashboardFinancesTab({ type }: DashboardFinancesTabProps) {
  const { orders } = useCart();

  const titles = {
    invoices: "Financial Invoices & Billing",
    transactions: "Payment Transactions Ledger",
    reports: "Fiscal Reports & Exports",
    analytics: "Financial Analytics & Profit Margins",
  };

  const descriptions = {
    invoices: "Download, audit, and reconcile automated buyer and wholesale receipts.",
    transactions: "Gateway payment intents, card authorizations, and chargeback logs.",
    reports: "Tax summary, periodic balance sheets, and inventory depreciation.",
    analytics: "Break-even analysis, average order value (AOV), and customer acquisition cost.",
  };

  // Compute live transaction ledger from actual store orders
  const transactions = useMemo(() => {
    return orders.map((o, idx) => ({
      id: `TX-${o.id.replace(/^ORD-/, "")}`,
      orderId: o.id,
      customer: o.customerName,
      method: o.paymentMethod || "Bakong KHQR",
      amount: Number(o.total) || 0,
      tax: Number(o.tax) || 0,
      status: "SETTLED",
      date: formatDate(o.createdAt),
    }));
  }, [orders]);

  const totalNetVolume = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const aov = useMemo(() => {
    return totalNetVolume / (transactions.length || 1);
  }, [totalNetVolume, transactions.length]);

  // Payment method breakdown
  const methodStats = useMemo(() => {
    const counts: Record<string, number> = {
      "Bakong KHQR": 0,
      "Credit Card": 0,
      "Cash on Delivery": 0,
    };
    orders.forEach((o) => {
      const m = o.paymentMethod || "Bakong KHQR";
      counts[m] = (counts[m] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Export Financial CSV
  const exportLedgerCsv = () => {
    if (transactions.length === 0) return;

    const headers = ["Transaction ID", "Order ID", "Customer", "Payment Method", "Date", "Gross Amount", "Tax", "Status"];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.orderId}"`,
      `"${t.customer.replace(/"/g, '""')}"`,
      `"${t.method}"`,
      `"${t.date}"`,
      t.amount,
      t.tax,
      `"${t.status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `techshop_financial_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 capitalize">
            {titles[type]}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            {descriptions[type]}
          </p>
        </div>

        <Button
          onClick={exportLedgerCsv}
          size="sm"
          className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial CSV</span>
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Total Net Volume
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
            {formatCurrency(totalNetVolume)}
          </div>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +18.2% vs last month
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
            {formatCurrency(aov)}
          </div>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            Live Customer Basket
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Payment Success Rate
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
            99.8%
          </div>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
            Zero chargeback incidents
          </span>
        </Card>
      </div>

      {/* Payment Gateway Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <p className="text-xs font-bold text-slate-500">Bakong KHQR</p>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {methodStats["Bakong KHQR"] || 0} Transactions
            </p>
          </div>
          <QrCode className="w-6 h-6 text-rose-500" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <p className="text-xs font-bold text-slate-500">Card / Online Gateway</p>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {methodStats["Credit Card"] || 0} Transactions
            </p>
          </div>
          <CreditCard className="w-6 h-6 text-blue-500" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-bold text-slate-500">Cash / Physical POS</p>
            <p className="text-lg font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {methodStats["Cash on Delivery"] || 0} Transactions
            </p>
          </div>
          <Wallet className="w-6 h-6 text-emerald-500" />
        </Card>
      </div>

      {/* Transactions / Records Table */}
      <Card className="overflow-hidden">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base">Recent Ledger Records</CardTitle>
          <CardDescription>Live settlements, card authorizations, and merchant deposits.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
              <TableHead>Transaction ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">
                  {tx.id}
                </TableCell>
                <TableCell className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                  {tx.orderId}
                </TableCell>
                <TableCell className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  {tx.customer}
                </TableCell>
                <TableCell className="text-xs text-slate-600 dark:text-zinc-300">
                  {tx.method}
                </TableCell>
                <TableCell className="text-xs text-slate-500 dark:text-zinc-400">
                  {tx.date}
                </TableCell>
                <TableCell className="font-extrabold text-sm text-slate-900 dark:text-zinc-50">
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
