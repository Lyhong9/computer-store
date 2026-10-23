"use client";

import { useCart } from "@/context/CartContext";

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
    tax,
    shipping,
    total,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h2 className="text-lg font-bold text-white">Your Cart</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300">
                {totalItems} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors text-sm"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="px-5 py-3 bg-zinc-950/60 border-b border-zinc-800/80 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-zinc-400 mb-1.5">
                Add{" "}
                <span className="font-bold text-indigo-400">
                  ${amountNeeded.toFixed(2)}
                </span>{" "}
                more to unlock <span className="font-bold text-white">Free Express Shipping</span>!
              </p>
            ) : (
              <p className="text-emerald-400 font-semibold mb-1.5 flex items-center gap-1">
                <span>🎉</span> You unlocked Free Express Shipping!
              </p>
            )}
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <span className="text-4xl mb-3">🛒</span>
                <p className="font-semibold text-zinc-300 text-base">
                  Your cart is empty
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Discover our flagship gaming laptops, RTX graphics cards, and high-performance CPUs.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  Browse Hardware Catalog
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 flex gap-3.5 items-start"
                >
                  {/* Item Icon */}
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0">
                    💻
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {product.name}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500 block">
                      {product.sku}
                    </span>
                    <span className="text-xs font-bold text-indigo-400 mt-1 block">
                      ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 text-xs text-zinc-400 hover:text-white rounded flex items-center justify-center hover:bg-zinc-800"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 text-xs text-zinc-400 hover:text-white rounded flex items-center justify-center hover:bg-zinc-800"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs text-red-400/80 hover:text-red-300 transition-colors p-1"
                        title="Remove Item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950/80 space-y-3">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-semibold">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-zinc-200 font-semibold">
                    ${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-zinc-200 font-semibold">
                    {shipping === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-zinc-800">
                  <span>Total Due</span>
                  <span className="text-indigo-400 text-base">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Clear
                </button>
                <button
                  id="cart-checkout-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
