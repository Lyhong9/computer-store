"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  Calendar,
  User,
  CreditCard,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Order } from "@/types/store";
import { formatCurrency, formatDate } from "@/lib/utils";
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
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DashboardOrdersTabProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}

export function DashboardOrdersTab({
  orders,
  onUpdateStatus,
}: DashboardOrdersTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
            <Clock className="w-3 h-3" />
            Confirmed
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            <Clock className="w-3 h-3" />
            Processing
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
            <Truck className="w-3 h-3" />
            Shipped
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Orders Management
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {orders.length} Total Orders
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Track customer shipments, process payments, and update delivery statuses.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search by Order ID, customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-slate-400" />}
              className="h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-xs focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-200">
              No orders found
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              No orders matched your current filters.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 dark:text-zinc-400">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                        {order.customerEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-zinc-300">
                    {order.items.reduce((acc, it) => acc + it.quantity, 0)} items
                  </TableCell>
                  <TableCell className="font-extrabold text-sm text-slate-900 dark:text-zinc-50">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedOrder(order)}
                      className="h-8 text-xs font-semibold px-3"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Order Details Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogHeader onClose={() => setSelectedOrder(null)}>
          <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
          <DialogDescription>
            Placed on {selectedOrder && formatDate(selectedOrder.createdAt)}
          </DialogDescription>
        </DialogHeader>

        {selectedOrder && (
          <div className="space-y-5 text-xs">
            {/* Status changer */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                Current Status:
              </span>
              <div className="flex gap-1.5">
                {(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const).map(
                  (st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedOrder.status === st ? "default" : "outline"}
                      onClick={() => {
                        onUpdateStatus(selectedOrder.id, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className="text-[10px] h-7 px-2.5 font-bold"
                    >
                      {st}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Customer Details
                </span>
                <p className="text-slate-600 dark:text-zinc-300 font-medium">
                  {selectedOrder.customerName}
                </p>
                <p className="text-slate-500 dark:text-zinc-400">
                  {selectedOrder.customerEmail}
                </p>
                <p className="text-slate-500 dark:text-zinc-400">
                  {selectedOrder.customerPhone}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery Address
                </span>
                <p className="text-slate-600 dark:text-zinc-300 font-medium">
                  {selectedOrder.shippingAddress}
                </p>
                <p className="text-slate-500 dark:text-zinc-400">
                  Payment Method: {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            {/* Order Items List */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-zinc-100 mb-2">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-zinc-800 border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between bg-white dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          it.product.images?.[0] ||
                          it.product.primaryImage ||
                          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
                        }
                        alt={it.product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-zinc-700"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-zinc-100 block">
                          {it.product.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Qty: {it.quantity} × {formatCurrency(it.product.price)}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-zinc-100">
                      {formatCurrency(it.product.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
              <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.tax > 0 && (
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Estimated Tax:</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-zinc-50 pt-1.5 border-t border-slate-200 dark:border-zinc-800">
                <span>Grand Total:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setSelectedOrder(null)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
