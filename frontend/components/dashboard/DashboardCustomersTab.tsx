"use client";

import React, { useState } from "react";
import { Users, Search, Mail, ShieldCheck, DollarSign, ShoppingBag, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export function DashboardCustomersTab() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "System Admin",
      username: "admin",
      email: "admin@techshop.com",
      role: "ADMIN",
      orders: 12,
      spent: 8490.0,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    },
    {
      id: 2,
      name: "Damly Hong",
      username: "damlyhong39",
      email: "damlyhong39@gmail.com",
      role: "ADMIN",
      orders: 5,
      spent: 3499.0,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    {
      id: 3,
      name: "Activator Code",
      username: "activatorcode9999",
      email: "activatorcode9999@gmail.com",
      role: "ADMIN",
      orders: 3,
      spent: 1849.99,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
    {
      id: 4,
      name: "Sarah Connor",
      username: "sconnor",
      email: "sconnor@cyberdyne.org",
      role: "CUSTOMER",
      orders: 8,
      spent: 4299.5,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    {
      id: 5,
      name: "Marcus Wright",
      username: "mwright",
      email: "marcus.wright@resistance.com",
      role: "CUSTOMER",
      orders: 2,
      spent: 1299.0,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80",
    },
  ]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Customers Directory
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {customers.length} Accounts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Registered accounts, buyer lifetime value and permissions management.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="max-w-md">
          <Input
            placeholder="Search customers by name, username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
            className="h-9 text-xs"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow
                key={c.id}
                className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 block">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-slate-400">@{c.username}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-600 dark:text-zinc-300">
                  {c.email}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.role === "ADMIN"
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    {c.role}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  {c.orders} orders
                </TableCell>
                <TableCell className="font-extrabold text-sm text-slate-900 dark:text-zinc-50">
                  {formatCurrency(c.spent)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {c.status}
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
