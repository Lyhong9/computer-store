"use client";

import React from "react";
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
} from "lucide-react";
import { normalizeImageUrl, handleImageError } from "@/lib/utils";

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
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
      {/* Backdrop with dark blur */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 pointer-events-none">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#0d121f] via-[#090d16] to-[#06080f] border-l border-white/[0.08] shadow-2xl shadow-black/80 flex flex-col pointer-events-auto text-slate-100 relative overflow-hidden">
          {/* Subtle ambient lighting decoration */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl" />

          {/* 1. Header */}
          <div className="px-6 py-4.5 border-b border-white/[0.07] bg-white/[0.02] backdrop-blur-xl flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">Shopping Cart</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Selected tech hardware &amp; products</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/[0.08] active:scale-90"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 shadow-inner">
                  <ShoppingBag className="w-9 h-9 opacity-50" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-200 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Explore our computers, premium laptops, hardware components, and accessories.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 active:scale-95"
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
                    className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.07] hover:border-white/[0.14] transition-all duration-200 flex gap-3.5 items-center group relative shadow-md shadow-black/20"
                  >
                    {/* Item Image Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-white/[0.08] p-1.5 flex items-center justify-center shrink-0 border border-white/10 shadow-xs overflow-hidden group-hover:border-cyan-500/40 transition-colors">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={product.name}
                          onError={(e) => handleImageError(e)}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
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
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block truncate">
                              {product.brandName}
                            </span>
                          )}
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Stepper & Price Row */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06]">
                        {/* Quantity controls */}
                        <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-0.5 shadow-inner">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 text-slate-400 hover:text-white rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 text-slate-400 hover:text-white rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-cyan-400">
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
            <div className="p-5 border-t border-white/[0.08] bg-[#090d16]/95 backdrop-blur-xl space-y-4 relative z-10">
              {/* Clean Pricing Breakdown (Express Shipping completely removed) */}
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="text-slate-200 font-semibold text-sm">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Total Line - strictly equal to subtotal */}
                <div className="flex justify-between items-baseline pt-3 border-t border-white/[0.08]">
                  <div>
                    <span className="text-sm font-bold text-white block">Total Due</span>
                    <span className="text-[10px] text-slate-400 font-medium">USD • No extra fees</span>
                  </div>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-0.5 flex gap-2.5">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 rounded-xl border border-white/[0.09] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
                >
                  Clear
                </button>
                <button
                  id="cart-checkout-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-center gap-3.5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Secure Checkout</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span>Bakong &amp; ABA</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Official Warranty</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
