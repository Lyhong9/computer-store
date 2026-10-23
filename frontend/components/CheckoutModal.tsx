"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types/store";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  onOrderSuccess,
}: CheckoutModalProps) {
  const { user } = useUser();
  const { items, subtotal, tax, shipping, total, placeOrder } = useCart();

  const [name, setName] = useState(
    user?.fullName || user?.firstName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""
  );
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [phone, setPhone] = useState("+855 12 345 678");
  const [address, setAddress] = useState(
    "Building 45, Monivong Blvd, Sangkat Boeung Keng Kang, Phnom Penh"
  );
  const [paymentMethod, setPaymentMethod] = useState("KHQR");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: name || "Customer",
        customerEmail: email || "customer@example.com",
        customerPhone: phone,
        shippingAddress: address,
        paymentMethod,
      });

      setIsSubmitting(false);
      onClose();
      onOrderSuccess(order);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Checkout & Delivery Details
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Complete your computer store order with secure processing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Customer info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              2. Payment Method
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium">
              {[
                { id: "KHQR", label: "ABA Pay / KHQR", icon: "📱" },
                { id: "CARD", label: "Credit / Debit Card", icon: "💳" },
                { id: "BANK", label: "Bank Transfer", icon: "🏦" },
                { id: "COD", label: "Cash on Delivery", icon: "💵" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    paymentMethod === m.id
                      ? "border-indigo-500 bg-indigo-500/10 text-white shadow-sm shadow-indigo-500/20"
                      : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="font-semibold text-xs text-white">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary box */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Items Total ({items.length} products)</span>
              <span className="text-zinc-200 font-semibold">
                ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Sales Tax (8%)</span>
              <span className="text-zinc-200 font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Express Courier Shipping</span>
              <span className="text-emerald-400 font-bold">
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-zinc-800">
              <span>Total Payable</span>
              <span className="text-indigo-400 text-lg">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-place-order-btn"
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm &amp; Place Order</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
