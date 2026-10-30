"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Laptop,
  ShieldCheck,
  Lock,
  Zap,
  UserCheck,
} from "lucide-react";
import { normalizeImageUrl, handleImageError } from "@/lib/utils";
import { AuthRequiredModal } from "./AuthRequiredModal";

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const { isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    total,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop with soft blur */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 pointer-events-none">
        <div className="w-screen max-w-md bg-white border-l border-slate-200/90 shadow-2xl flex flex-col pointer-events-auto text-slate-900 relative overflow-hidden">
          {/* Subtle ambient lighting decoration */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 -left-24 w-60 h-60 bg-sky-400/10 rounded-full blur-3xl" />

          {/* 1. Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 bg-white/90 backdrop-blur-xl flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Shopping Cart</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Selected tech hardware &amp; products</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all duration-200 border border-slate-200 active:scale-90"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 relative z-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-inner">
                  <ShoppingBag className="w-9 h-9 opacity-70" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Explore our computers, premium laptops, hardware components, and accessories.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discover Products</span>
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }, idx) => {
                const itemImage = normalizeImageUrl(product.primaryImage || (product.images && product.images[0]));
                const itemTotal = (product.price * quantity).toFixed(2);

                return (
                  <div
                    key={`cart-item-${product.id || idx}-${idx}`}
                    className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex gap-3.5 items-center group relative shadow-2xs"
                  >
                    {/* Item Image Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-white shrink-0 border border-slate-200 shadow-xs overflow-hidden group-hover:border-blue-400 transition-colors flex items-center justify-center">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={product.name}
                          onError={(e) => handleImageError(e)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <Laptop className="w-7 h-7 text-slate-400" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {product.brandName && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block truncate">
                              {product.brandName}
                            </span>
                          )}
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h4>
                          {product.sku && (
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              {product.sku}
                            </span>
                          )}
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Stepper & Price Row */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/70">
                        {/* Quantity controls */}
                        <div className="flex items-center rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 text-slate-600 hover:text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 text-slate-600 hover:text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right">
                          <span className="text-sm font-black text-blue-600">
                            ${Number(itemTotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          {quantity > 1 && (
                            <span className="text-[10px] text-slate-400 block">
                              ${product.price.toFixed(2)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 3. Footer & Checkout Section - NO EXPRESS SHIPPING FEE - STRICTLY JUST ONLY ITEM TOTAL */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white/95 backdrop-blur-xl space-y-4 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
              {/* Clean Pricing Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-800 font-bold text-sm">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Total Line - strictly equal to subtotal */}
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200/80">
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 block">Total Due</span>
                    <span className="text-[10px] text-slate-400 font-medium">USD • No extra fees</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Account Required Notice for Unauthenticated Guests */}
              {!isSignedIn && (
                <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 flex items-start gap-3 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs shadow-blue-500/20">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-blue-950 leading-tight">Account Required to Order</p>
                    <p className="text-[11px] text-blue-800/80 leading-snug mt-0.5">
                      Please sign in or register before buying to secure warranty and track delivery.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-0.5 flex gap-2.5">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all active:scale-95"
                >
                  Clear
                </button>
                <button
                  id="cart-checkout-btn"
                  onClick={() => {
                    if (!isSignedIn) {
                      setShowAuthModal(true);
                      return;
                    }
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="flex-1 py-3 px-5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  {!isSignedIn ? (
                    <>
                      <Lock className="w-4 h-4 text-white" />
                      <span>Sign In to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3.5 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-blue-600" />
                  <span>Secure Checkout</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-600" />
                  <span>Bakong &amp; ABA</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Official Warranty</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Required Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl="/"
        cartItemCount={totalItems}
      />
    </div>
  );
}
