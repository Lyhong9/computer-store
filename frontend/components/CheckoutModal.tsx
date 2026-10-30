"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types/store";
import { ordersApi } from "@/services/api";
import { BakongKhqrModal } from "@/components/BakongKhqrModal";
import { AbaPaywayModal } from "@/components/AbaPaywayModal";
import {
  Lock,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Receipt,
  Truck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

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
  const { user, isSignedIn, isLoaded } = useUser();
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

  // Sync user info when authenticated
  useEffect(() => {
    if (user) {
      const derivedName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "";
      if (derivedName && !name) setName(derivedName);
      if (user.primaryEmailAddress?.emailAddress) {
        setEmail(user.primaryEmailAddress.emailAddress);
      }
    }
  }, [user]);

  // Modals for payment
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [showBakongModal, setShowBakongModal] = useState(false);
  const [showAbaModal, setShowAbaModal] = useState(false);

  if (!isOpen && !showBakongModal && !showAbaModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      return;
    }
    setIsSubmitting(true);

    try {
      const backendOrder = await ordersApi.checkout({
        customerName: name || user?.fullName || "Verified Customer",
        customerEmail: email || user?.primaryEmailAddress?.emailAddress || "customer@example.com",
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
        customerName: name || user?.fullName || "Verified Customer",
        customerEmail: email || user?.primaryEmailAddress?.emailAddress || "customer@example.com",
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

  // If not signed in, show the Account Required Gate
  if (isLoaded && !isSignedIn) {
    return (
      <>
        {isOpen && !showBakongModal && !showAbaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

            <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-slate-900 my-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="text-center space-y-3 pt-2">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 ring-4 ring-blue-100">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 mb-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Customer Account Required</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Sign In or Register to Order
                  </h2>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    To guarantee official warranty coverage, digital tax invoices, and real-time delivery tracking, you must have an active customer account.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">12 - 36 Months Warranty</h4>
                    <p className="text-[11px] text-slate-500">
                      Hardware serials and genuine manufacturer warranty are bound to your verified account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100/70 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Automated Tax Invoice</h4>
                    <p className="text-[11px] text-slate-500">
                      Download official PDF receipts and verify instant Bakong KHQR / ABA PayWay settlements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Live Delivery Tracking</h4>
                    <p className="text-[11px] text-slate-500">
                      Track status updates from warehouse assembly to fast doorstep delivery across Cambodia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <Link
                  href="/sign-in?redirect_url=/"
                  onClick={onClose}
                  className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In to Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/sign-up?redirect_url=/"
                  onClick={onClose}
                  className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Create Free Account (Register)</span>
                </Link>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  ← Return to Shopping Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {isOpen && !showBakongModal && !showAbaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Checkout &amp; Delivery Details
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete your computer store order with Cambodia&apos;s leading payment options.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm border border-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Verified Account Status */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      Verified Account: {user?.fullName || user?.firstName || user?.username || "Customer"}
                    </span>
                    <span className="text-[11px] text-blue-600 font-mono block truncate">
                      {email || user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  AUTHENTICATED
                </span>
              </div>

              {/* Customer info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  1. Customer &amp; Delivery Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-700 block mb-1 font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dam Lyhong"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 block mb-1 font-semibold flex items-center justify-between">
                      <span>Account Email</span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Verified
                      </span>
                    </label>
                    <input
                      type="email"
                      required
                      readOnly
                      value={email}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-600 cursor-not-allowed opacity-90 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-700 block mb-1 font-semibold">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 block mb-1 font-semibold">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, Postal Code"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    2. Select Payment Gateway
                  </h3>
                  <span className="text-[11px] text-slate-500">Instant Verification Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
                  {/* Bakong KHQR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("BAKONG_KHQR")}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                      paymentMethod === "BAKONG_KHQR"
                        ? "border-red-500 bg-red-50/70 text-slate-900 shadow-sm ring-1 ring-red-400/50"
                        : "border-slate-200 bg-slate-50/50 hover:bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                        KHQR
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-600 border border-red-200">
                        NBC BAKONG
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">Bakong KHQR</span>
                      <span className="text-[11px] text-slate-500">Scan with 50+ Cambodian Banks</span>
                    </div>
                  </button>

                  {/* ABA PayWay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ABA_PAYWAY")}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                      paymentMethod === "ABA_PAYWAY"
                        ? "border-blue-600 bg-blue-50/70 text-slate-900 shadow-sm ring-1 ring-blue-500/50"
                        : "border-slate-200 bg-slate-50/50 hover:bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-[#003366] text-white flex items-center justify-center font-black text-xs shadow-sm">
                        ABA
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-700 border border-blue-200">
                        PAYWAY
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">ABA PayWay</span>
                      <span className="text-[11px] text-slate-500">ABA Mobile, Cards &amp; PayWay</span>
                    </div>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                      paymentMethod === "COD"
                        ? "border-emerald-500 bg-emerald-50/70 text-slate-900 shadow-sm ring-1 ring-emerald-400/50"
                        : "border-slate-200 bg-slate-50/50 hover:bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm shadow-sm">
                        💵
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        OFFLINE
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">Cash on Delivery</span>
                      <span className="text-[11px] text-slate-500">Pay when receiving hardware</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Summary box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Total ({items.length} products)</span>
                  <span className="text-slate-900 font-bold">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">
                    FREE ($0.00)
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-blue-600 font-black text-xl">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-place-order-btn"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
