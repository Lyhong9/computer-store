"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types/store";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";

export default function OrdersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { orders } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const activeOrder = selectedOrder || (filteredOrders.length > 0 ? filteredOrders[0] : null);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "PROCESSING":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "SHIPPED":
        return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
      case "DELIVERED":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const getStepActive = (currentStatus: Order["status"], step: string) => {
    const steps = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);
    return stepIndex <= currentIndex;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-300 mb-2">
              <span>📦</span>
              <span>Real-Time Order Tracking</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Order History & Tracking
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Track warehouse processing, shipment status, and print purchase receipts.
            </p>
          </div>

          <Link
            href="/"
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Storefront</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-6 pb-6 overflow-x-auto scrollbar-none">
          <span className="text-xs text-zinc-500 font-semibold mr-1">Status:</span>
          {["all", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {status === "all" ? "All Orders" : status}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 my-8">
            <span className="text-5xl">🛍️</span>
            <h3 className="mt-4 text-xl font-bold text-white">No orders placed yet</h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
              Your shopping cart is ready. Explore our high-performance hardware catalog and complete your first checkout!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
              >
                Browse Store Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders List Sidebar */}
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
                Recent Orders ({filteredOrders.length})
              </h2>

              {filteredOrders.map((order) => {
                const isSelected = activeOrder?.id === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-zinc-900 border-indigo-500/80 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/50"
                        : "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        {order.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white line-clamp-1">
                      {order.items.map((i) => i.product.name).join(", ")}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800/60">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="font-mono font-bold text-white text-sm">
                        ${order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Details & Timeline Pane */}
            {activeOrder && (
              <div className="lg:col-span-7 bg-zinc-900/70 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                      Order Reference
                    </span>
                    <h3 className="text-xl font-black text-white font-mono tracking-tight">
                      {activeOrder.id}
                    </h3>
                    <span className="text-xs text-zinc-400 block mt-0.5">
                      Placed on {new Date(activeOrder.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <span
                    className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(
                      activeOrder.status
                    )}`}
                  >
                    ● {activeOrder.status}
                  </span>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="py-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6">
                    Fulfillment Progress
                  </h4>

                  <div className="grid grid-cols-4 gap-2 text-center relative">
                    {/* Connecting Bar */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-zinc-800 -z-0"></div>

                    {[
                      { step: "CONFIRMED", label: "Confirmed", icon: "✓" },
                      { step: "PROCESSING", label: "Warehouse", icon: "⚙️" },
                      { step: "SHIPPED", label: "Shipped", icon: "🚚" },
                      { step: "DELIVERED", label: "Delivered", icon: "📦" },
                    ].map((st) => {
                      const isActive = getStepActive(activeOrder.status, st.step);

                      return (
                        <div key={st.step} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-indigo-600/40 ring-4 ring-zinc-950"
                                : "bg-zinc-800 text-zinc-500 ring-4 ring-zinc-950"
                            }`}
                          >
                            {st.icon}
                          </div>
                          <span
                            className={`mt-2 text-[11px] font-semibold ${
                              isActive ? "text-white" : "text-zinc-500"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                    Purchased Items ({activeOrder.items.length})
                  </h4>

                  <div className="space-y-3">
                    {activeOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-850"
                      >
                        <div className="flex-1 pr-4">
                          <h5 className="text-sm font-bold text-white">
                            {item.product.name}
                          </h5>
                          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                            SKU: {item.product.sku} • Qty: {item.quantity} × $
                            {item.product.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-white font-mono">
                          $
                          {(item.product.price * item.quantity).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                      Delivery Destination
                    </span>
                    <div className="text-sm font-semibold text-white">
                      {activeOrder.customerName}
                    </div>
                    <div className="text-zinc-400">{activeOrder.shippingAddress}</div>
                    <div className="text-zinc-400 font-mono">{activeOrder.customerPhone}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                      Payment & Billing
                    </span>
                    <div className="text-sm font-semibold text-white">
                      Method: {activeOrder.paymentMethod}
                    </div>
                    <div className="text-zinc-400">Account: {activeOrder.customerEmail}</div>
                    <div className="text-emerald-400 font-semibold">Payment Verified ✓</div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-zinc-200">
                      ${activeOrder.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-mono text-zinc-200">
                      ${activeOrder.tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-mono text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                    <span>Grand Total</span>
                    <span className="font-mono text-lg text-indigo-400">
                      ${activeOrder.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(o) => setSuccessOrder(o)}
      />
      <OrderSuccessModal order={successOrder} onClose={() => setSuccessOrder(null)} />
    </div>
  );
}
