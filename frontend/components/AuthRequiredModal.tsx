"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Receipt,
  Truck,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  cartItemCount?: number;
}

export function AuthRequiredModal({
  isOpen,
  onClose,
  redirectUrl = "/",
  cartItemCount = 0,
}: AuthRequiredModalProps) {
  if (!isOpen) return null;

  const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;
  const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-slate-900">
        {/* Glow ambient background effects */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 bg-sky-400/10 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 ring-4 ring-blue-100">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 mb-2">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Customer Account Required</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sign In or Register to Order
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              To guarantee warranty coverage, invoice generation, and order tracking, please sign in or register before completing your purchase.
            </p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Official Cambodian Warranty</h4>
              <p className="text-[11px] text-slate-500">
                Hardware serials and 12-to-36 months genuine warranty are automatically bound to your account.
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
            href={signInUrl}
            onClick={onClose}
            className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href={signUpUrl}
            onClick={onClose}
            className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>Create Free Account (Register)</span>
          </Link>
        </div>

        {/* Cart Persisted Reminder */}
        {cartItemCount > 0 && (
          <p className="text-[11px] text-center text-slate-500 mt-4">
            Don&apos;t worry! Your <span className="text-blue-600 font-bold">{cartItemCount} cart items</span> will remain saved when you return.
          </p>
        )}
      </div>
    </div>
  );
}

