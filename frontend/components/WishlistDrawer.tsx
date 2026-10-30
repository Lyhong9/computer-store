"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import {
  Heart,
  X,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Check,
  Package,
} from "lucide-react";
import { formatCurrency, normalizeImageUrl, handleImageError } from "@/lib/utils";
import { Product } from "@/types/store";

interface WishlistDrawerProps {
  onQuickView?: (product: Product) => void;
  onExploreShop?: () => void;
}

export function WishlistDrawer({
  onQuickView,
  onExploreShop,
}: WishlistDrawerProps) {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    totalWishlistItems,
  } = useWishlist();

  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = React.useState<Record<number, boolean>>({});

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((p) => addToCart(p, 1));
    const allAdded = wishlist.reduce((acc, p) => ({ ...acc, [p.id]: true }), {});
    setAddedIds(allAdded);
    setTimeout(() => {
      setAddedIds({});
    }, 1500);
  };

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans antialiased animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200/90 text-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-2">
                  <span>My Wishlist</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-bold">
                    {totalWishlistItems}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Products you have saved for later
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {wishlist.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                  title="Clear Wishlist"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
                title="Close Wishlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-inner">
                  <Heart className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-base font-bold text-slate-900">Your wishlist is empty</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Explore our high-performance hardware, laptops, and accessories and click the heart icon to save your favorites!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    onExploreShop?.();
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discover Products</span>
                </button>
              </div>
            ) : (
              wishlist.map((product) => {
                const isAdded = addedIds[product.id];
                return (
                  <div
                    key={`wishlist-item-${product.id}`}
                    className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex gap-3.5 items-center group relative shadow-2xs"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        onQuickView?.(product);
                      }}
                      className="w-16 h-16 rounded-xl bg-white shrink-0 border border-slate-200 shadow-xs overflow-hidden group-hover:border-rose-400 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={normalizeImageUrl(product.primaryImage || (product.images && product.images[0]))}
                        alt={product.name}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">
                          {product.categoryName || "Hardware"}
                        </span>
                        {product.quantityOnHand > 0 ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <h4
                        onClick={() => onQuickView?.(product)}
                        className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors truncate cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-rose-600">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
                        }`}
                        title="Add to Shopping Cart"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span className="text-[11px]">Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            <span className="text-[11px]">Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white/95 backdrop-blur-xl space-y-2.5">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="w-full py-3 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add All ({wishlist.length}) to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsWishlistOpen(false);
                  onExploreShop?.();
                }}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
