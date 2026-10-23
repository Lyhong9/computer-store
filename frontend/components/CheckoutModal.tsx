"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types/store";
import { ordersApi } from "@/services/api";
import { BakongKhqrModal } from "@/components/BakongKhqrModal";
import { AbaPaywayModal } from "@/components/AbaPaywayModal";

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
  const { items, subtotal, tax, shipping, total, placeOrder, clearCart } = useCart();

  const [name, setName] = useState(
    user?.fullName || user?.firstName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""
  );
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [phone, setPhone] = useState("+855 96 899 9414");
  const [address, setAddress] = useState(
    "Building 45, Monivong Blvd, Sangkat Boeung Keng Kang, Phnom Penh"
  );
  const [paymentMethod, setPaymentMethod] = useState("BAKONG_KHQR");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals for payment
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [showBakongModal, setShowBakongModal] = useState(false);
  const [showAbaModal, setShowAbaModal] = useState(false);

  if (!isOpen && !showBakongModal && !showAbaModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const backendOrder = await ordersApi.checkout({
        customerName: name || "Customer",
        customerEmail: email || "customer@example.com",
        customerPhone: phone,
        shippingAddress: address,
        paymentMethod,
        items: items.map((i) => ({
          productId: Number(i.product.id),
          quantity: i.quantity,
        })),
      });

      const formattedOrder: Order = {
        id: (backendOrder as any).orderNumber || String(backendOrder.id),
        createdAt: new Date().toISOString(),
        customerName: backendOrder.customerName,
        customerEmail: backendOrder.customerEmail,
        customerPhone: backendOrder.customerPhone || phone,
        shippingAddress: backendOrder.shippingAddress,
        paymentMethod: backendOrder.paymentMethod || paymentMethod,
        items,
        subtotal: Number(backendOrder.subtotal) || subtotal,
        tax: Number(backendOrder.tax) || tax,
        total: Number(backendOrder.total) || total,
        status: (backendOrder.status as any) || "CONFIRMED",
      };

      clearCart();
      setIsSubmitting(false);

      if (paymentMethod === "BAKONG_KHQR") {
        setPendingOrder(formattedOrder);
        setShowBakongModal(true);
      } else if (paymentMethod === "ABA_PAYWAY") {
        setPendingOrder(formattedOrder);
        setShowAbaModal(true);
      } else {
        onClose();
        onOrderSuccess(formattedOrder);
      }
    } catch (err) {
      console.warn("Backend checkout error, using local fallback:", err);
      const localOrder = placeOrder({
        customerName: name || "Customer",
        customerEmail: email || "customer@example.com",
        customerPhone: phone,
        shippingAddress: address,
        paymentMethod,
      });

      setIsSubmitting(false);

      if (paymentMethod === "BAKONG_KHQR") {
        setPendingOrder(localOrder);
        setShowBakongModal(true);
      } else if (paymentMethod === "ABA_PAYWAY") {
        setPendingOrder(localOrder);
        setShowAbaModal(true);
      } else {
        onClose();
        onOrderSuccess(localOrder);
      }
    }
  };

  const handlePaymentCompleted = (confirmedOrder: Order) => {
    setShowBakongModal(false);
    setShowAbaModal(false);
    setPendingOrder(null);
    onClose();
    onOrderSuccess(confirmedOrder);
  };

  return (
    <>
      {isOpen && !showBakongModal && !showAbaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Checkout &amp; Delivery Details
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Complete your computer store order with Cambodia&apos;s leading payment options.
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  1. Customer &amp; Delivery Information
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
                      placeholder="e.g. Dam Lyhong"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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
                      placeholder="dam_lyhong@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    2. Select Payment Gateway
                  </h3>
                  <span className="text-[11px] text-zinc-400">Instant Verification Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
                  {/* Bakong KHQR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("BAKONG_KHQR")}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                      paymentMethod === "BAKONG_KHQR"
                        ? "border-red-500 bg-red-950/20 text-white shadow-md shadow-red-950/40"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                        KHQR
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
                        NBC BAKONG
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Bakong KHQR</span>
                      <span className="text-[11px] text-zinc-400">Scan with 50+ Cambodian Banks</span>
                    </div>
                  </button>

                  {/* ABA PayWay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ABA_PAYWAY")}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                      paymentMethod === "ABA_PAYWAY"
                        ? "border-cyan-500 bg-cyan-950/20 text-white shadow-md shadow-cyan-950/40"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-[#003366] text-white flex items-center justify-center font-black text-xs shadow-sm">
                        ABA
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        PAYWAY
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">ABA PayWay</span>
                      <span className="text-[11px] text-zinc-400">ABA Mobile, Cards &amp; PayWay</span>
                    </div>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                      paymentMethod === "COD"
                        ? "border-emerald-500 bg-emerald-950/20 text-white shadow-md shadow-emerald-950/40"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm shadow-sm">
                        💵
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        OFFLINE
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Cash on Delivery</span>
                      <span className="text-[11px] text-zinc-400">Pay when receiving hardware</span>
                    </div>
                  </button>
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
                  <span className="text-cyan-400 text-lg">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
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
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white text-sm font-bold shadow-xl shadow-cyan-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to {paymentMethod === "BAKONG_KHQR" ? "Bakong KHQR" : paymentMethod === "ABA_PAYWAY" ? "ABA PayWay" : "Confirmation"}</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bakong KHQR Modal */}
      <BakongKhqrModal
        isOpen={showBakongModal}
        order={pendingOrder}
        onClose={() => {
          setShowBakongModal(false);
          onClose();
          if (pendingOrder) onOrderSuccess(pendingOrder);
        }}
        onPaymentSuccess={handlePaymentCompleted}
      />

      {/* ABA PayWay Modal */}
      <AbaPaywayModal
        isOpen={showAbaModal}
        order={pendingOrder}
        onClose={() => {
          setShowAbaModal(false);
          onClose();
          if (pendingOrder) onOrderSuccess(pendingOrder);
        }}
        onPaymentSuccess={handlePaymentCompleted}
      />
    </>
  );
}
