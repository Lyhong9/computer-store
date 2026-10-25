"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Printer,
  Download,
  DollarSign,
  TrendingUp,
  PackageCheck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Order } from "@/types/store";
import { formatCurrency, formatDate, normalizeImageUrl, handleImageError } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModernSelect } from "@/components/ui/select";
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
import { OrderInvoiceModal } from "@/components/dashboard/OrderInvoiceModal";
import { ordersApi } from "@/services/api";

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
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Tracking dialog state
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState("J&T Express");
  const [trackingNumber, setTrackingNumber] = useState("");

  const CARRIERS = [
    "J&T Express",
    "Virak Buntham (VET)",
    "GrabExpress",
    "Kerry Express Cambodia",
    "Capitol Tour Express",
    "DHL Express",
  ];

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        (o.customerPhone && o.customerPhone.includes(search));

      const matchesStatus =
        statusFilter === "ALL" || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Aggregate KPI Stats
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === "CONFIRMED" || o.status === "PROCESSING").length;
  }, [orders]);

  const deliveredCount = useMemo(() => {
    return orders.filter((o) => o.status === "DELIVERED").length;
  }, [orders]);

  const handleStatusChange = async (orderId: string, st: Order["status"]) => {
    if (st === "SHIPPED") {
      const target = orders.find((o) => o.id === orderId);
      if (target) {
        setTrackingOrder(target);
        setTrackingNumber(target.trackingNumber || `TRK-${Date.now().toString().slice(-6)}`);
        return;
      }
    }

    onUpdateStatus(orderId, st);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: st });
    }

    try {
      await ordersApi.updateStatus(orderId, st);
    } catch {
      // Handled in client context
    }
  };

  const submitShippingTracking = async () => {
    if (!trackingOrder) return;
    const updatedOrder: Order = {
      ...trackingOrder,
      status: "SHIPPED",
      carrier,
      trackingNumber,
    };
    onUpdateStatus(trackingOrder.id, "SHIPPED");
    if (selectedOrder?.id === trackingOrder.id) {
      setSelectedOrder(updatedOrder);
    }
    try {
      await ordersApi.updateStatus(trackingOrder.id, "SHIPPED");
    } catch {
      // Handled
    }
    setTrackingOrder(null);
  };

  const exportOrdersCsv = () => {
    if (orders.length === 0) return;

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Items Count",
      "Subtotal",
      "Tax",
      "Grand Total",
      "Status",
      "Payment Method",
      "Shipping Address",
      "Carrier",
      "Tracking Number",
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerEmail}"`,
      `"${o.customerPhone || ""}"`,
      o.items.reduce((acc, it) => acc + it.quantity, 0),
      o.subtotal || 0,
      o.tax || 0,
      o.total || 0,
      `"${o.status}"`,
      `"${o.paymentMethod || "KHQR"}"`,
      `"${(o.shippingAddress || "").replace(/"/g, '""')}"`,
      `"${o.carrier || ""}"`,
      `"${o.trackingNumber || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `techshop_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      {/* Top Header with Action Buttons */}
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
            Track customer shipments, print tax invoices, and update delivery statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportOrdersCsv}
            variant="outline"
            size="sm"
            className="h-9 px-3.5 text-xs font-bold gap-1.5 text-slate-700 dark:text-zinc-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Order Volume
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-zinc-50 mt-1">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Orders Placed
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-zinc-50 mt-1">
              {orders.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending Fulfillment
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {pendingCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Successfully Delivered
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {deliveredCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search by Order ID, customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-slate-400" />}
              className="h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <ModernSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(String(val))}
              size="md"
              options={[
                {
                  value: "ALL",
                  label: "All Statuses",
                  icon: <span className="w-2 h-2 rounded-full bg-slate-400" />,
                },
                {
                  value: "CONFIRMED",
                  label: "Confirmed",
                  icon: <span className="w-2 h-2 rounded-full bg-blue-500" />,
                },
                {
                  value: "PROCESSING",
                  label: "Processing",
                  icon: <span className="w-2 h-2 rounded-full bg-amber-500" />,
                },
                {
                  value: "SHIPPED",
                  label: "Shipped",
                  icon: <span className="w-2 h-2 rounded-full bg-purple-500" />,
                },
                {
                  value: "DELIVERED",
                  label: "Delivered",
                  icon: <span className="w-2 h-2 rounded-full bg-emerald-500" />,
                },
              ]}
            />
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
              No orders matched your current search filters.
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
                        {order.customerEmail || order.customerPhone}
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
                  <TableCell className="text-right space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInvoiceOrder(order)}
                      title="Print Official Tax Invoice"
                      className="h-8 text-xs font-semibold px-2.5 gap-1 text-slate-700 dark:text-zinc-300 hover:text-blue-600"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Invoice</span>
                    </Button>

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
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                Update Order Status:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const).map(
                  (st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedOrder.status === st ? "default" : "outline"}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className="text-[10px] h-7 px-2.5 font-bold cursor-pointer"
                    >
                      {st}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Carrier & Tracking if shipped */}
            {selectedOrder.trackingNumber && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-purple-900 dark:text-purple-200">
                    Carrier: {selectedOrder.carrier || "Courier Express"}
                  </span>
                </div>
                <span className="font-mono font-bold text-xs text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-900/50 px-2.5 py-1 rounded-md border border-purple-200">
                  {selectedOrder.trackingNumber}
                </span>
              </div>
            )}

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
                  {selectedOrder.customerPhone || "No phone provided"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery Address
                </span>
                <p className="text-slate-600 dark:text-zinc-300 font-medium">
                  {selectedOrder.shippingAddress || "Store Pickup"}
                </p>
                <p className="text-slate-500 dark:text-zinc-400">
                  Payment Method: <span className="font-bold text-slate-800 dark:text-zinc-200">{selectedOrder.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Order Items List */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-zinc-100 mb-2">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-zinc-800 border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between bg-white dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={normalizeImageUrl(
                          it.product.images?.[0] ||
                          it.product.primaryImage
                        )}
                        alt={it.product.name}
                        onError={(e) => handleImageError(e)}
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
                  <span>Estimated Tax (8%):</span>
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

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (selectedOrder) setInvoiceOrder(selectedOrder);
            }}
            className="gap-1.5 text-xs font-bold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </Button>

          <Button variant="default" onClick={() => setSelectedOrder(null)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Shipping Tracking Prompt Dialog */}
      <Dialog
        open={!!trackingOrder}
        onOpenChange={(open) => !open && setTrackingOrder(null)}
      >
        <DialogHeader onClose={() => setTrackingOrder(null)}>
          <DialogTitle>Ship Order #{trackingOrder?.id}</DialogTitle>
          <DialogDescription>
            Provide shipping carrier and tracking information to dispatch this order.
          </DialogDescription>
        </DialogHeader>

        {trackingOrder && (
          <div className="space-y-4 text-xs py-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Shipping Carrier / Logistics Partner
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CARRIERS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCarrier(c)}
                    className={`py-2 px-3 rounded-xl border text-left font-semibold transition-all ${
                      carrier === c
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Waybill / Tracking Number
              </label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. TRK-849201"
                className="font-mono text-xs"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setTrackingOrder(null)}>
            Cancel
          </Button>
          <Button onClick={submitShippingTracking} className="bg-blue-600 text-white font-bold">
            Confirm & Dispatch
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Printable Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
}
