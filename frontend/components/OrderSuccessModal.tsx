"use client";

import Link from "next/link";
import { Order } from "@/types/store";

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderSuccessModal({ order, onClose }: OrderSuccessModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center animate-fadeIn">
        {/* Animated Checkmark Circle */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 text-2xl font-bold shadow-lg shadow-emerald-500/20">
          ✓
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          Order Successfully Placed!
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Thank you for choosing TechShop. Your order has been dispatched to our fulfillment warehouse.
        </p>

        {/* Order Details Card */}
        <div className="mt-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-zinc-800/80">
            <span className="text-zinc-400">Order Reference</span>
            <span className="font-mono font-bold text-indigo-400 text-sm">
              {order.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Customer Name</span>
            <span className="font-semibold text-zinc-200">{order.customerName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Payment Method</span>
            <span className="font-semibold text-zinc-200">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Shipping To</span>
            <span className="font-semibold text-zinc-200 truncate max-w-[220px]">
              {order.shippingAddress}
            </span>
          </div>

          {/* Items Summary */}
          <div className="pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
              Items Ordered ({order.items.length})
            </span>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-zinc-300 text-[11px]"
                >
                  <span className="truncate max-w-[240px]">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-sm font-extrabold text-white pt-2.5 border-t border-zinc-800">
            <span>Total Paid</span>
            <span className="text-emerald-400 text-base">
              ${order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/orders"
            id="success-view-orders-link"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all text-center"
          >
            Track in My Orders
          </Link>
          <button
            onClick={onClose}
            id="success-continue-shopping-btn"
            className="flex-1 py-3 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
