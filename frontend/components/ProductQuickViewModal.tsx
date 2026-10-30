"use client";

import { useState } from "react";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";
import {
  normalizeImageUrl,
  handleImageError,
  DEFAULT_PRODUCT_PLACEHOLDER,
} from "@/lib/utils";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  onClose,
}: ProductQuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="quickview-close-btn"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-sm border border-slate-200"
        >
          ✕
        </button>

        {/* Header tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {product.brandName && (
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
              {product.brandName}
            </span>
          )}
          {product.categoryName && (
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {product.categoryName}
            </span>
          )}
          <span className="text-xs font-mono text-slate-400">
            SKU: {product.sku}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {product.name}
        </h2>

        {/* Multiple Images Gallery */}
        {(() => {
          const imgList =
            product.images && product.images.length > 0
              ? product.images.map(normalizeImageUrl)
              : product.primaryImage
              ? [normalizeImageUrl(product.primaryImage)]
              : [DEFAULT_PRODUCT_PLACEHOLDER];

          return (
            <div className="my-4 space-y-2">
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-xs flex items-center justify-center">
                <img
                  src={normalizeImageUrl(imgList[activeImgIndex < imgList.length ? activeImgIndex : 0])}
                  alt={product.name}
                  onError={(e) => handleImageError(e)}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-md shadow-xs">
                  {activeImgIndex + 1} / {imgList.length}
                </div>
              </div>

              {imgList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {imgList.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImgIndex(i)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 ${
                        activeImgIndex === i
                          ? "border-blue-600 scale-105 shadow-md shadow-blue-500/20"
                          : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={normalizeImageUrl(img)}
                        alt={`Thumb ${i}`}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {product.description}
        </p>

        {/* Detailed Specs Table */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Hardware Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs).map(([label, val]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-slate-500 font-medium">{label}</span>
                  <span className="text-slate-900 font-semibold mt-0.5">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warranty & Delivery Info */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-600 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>3 Years Manufacturer Warranty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Free Express Delivery (Phnom Penh)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Factory Sealed &amp; Genuine</span>
          </div>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500 block">Unit Price</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600">
              ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Quantity Selector */}
            <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-lg text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="w-9 text-center text-sm font-bold text-slate-900">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-lg text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isInWishlist(product.id)
                  ? "bg-rose-50 text-rose-600 border-rose-200 shadow-sm"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-200"
              }`}
              title={isInWishlist(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isInWishlist(product.id) ? "fill-rose-500 text-rose-500 scale-110" : ""
                }`}
              />
              <span className="text-xs">
                {isInWishlist(product.id) ? "Saved" : "Wishlist"}
              </span>
            </button>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              id="quickview-add-to-cart-btn"
              disabled={added}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {added ? (
                <>
                  <span>✓ Added to Cart</span>
                </>
              ) : (
                <>
                  <span>🛒 Add to Cart</span>
                  <span className="text-blue-100">
                    (${(product.price * qty).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
