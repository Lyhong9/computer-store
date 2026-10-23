"use client";

import React from "react";
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
import { formatCurrency } from "@/lib/utils";

interface DashboardFinancesTabProps {
  type: "invoices" | "transactions" | "reports" | "analytics";
}

export function DashboardFinancesTab({ type }: DashboardFinancesTabProps) {
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

  const sampleTransactions = [
    { id: "TX-9901", order: "ORD-8492", method: "Stripe Card (Visa)", amount: 3499.0, status: "COMPLETED", date: "Oct 23, 2026" },
    { id: "TX-9902", order: "ORD-8491", method: "PayPal Express", amount: 1999.0, status: "COMPLETED", date: "Oct 22, 2026" },
    { id: "TX-9903", order: "ORD-8490", method: "Apple Pay", amount: 849.99, status: "COMPLETED", date: "Oct 21, 2026" },
    { id: "TX-9904", order: "ORD-8489", method: "Wire Transfer", amount: 5499.0, status: "SETTLED", date: "Oct 20, 2026" },
  ];

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

        <Button size="sm" className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Total Net Volume
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
            $118,450.00
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
            $1,420.50
          </div>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +6.5% vs last month
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Payment Success Rate
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-50 mt-1">
            99.4%
          </div>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            High reliability
          </span>
        </Card>
      </div>

      {/* Transactions / Records Table */}
      <Card className="overflow-hidden">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base">Recent Ledger Records</CardTitle>
          <CardDescription>All settlements, card authorizations, and merchant deposits.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
              <TableHead>Transaction ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTransactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">
                  {tx.id}
                </TableCell>
                <TableCell className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                  {tx.order}
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
