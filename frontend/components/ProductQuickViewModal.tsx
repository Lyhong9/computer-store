"use client";

import { useState } from "react";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  onClose,
}: ProductQuickViewModalProps) {
  const { addToCart } = useCart();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="quickview-close-btn"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors text-sm"
        >
          ✕
        </button>

        {/* Header tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {product.brandName && (
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {product.brandName}
            </span>
          )}
          {product.categoryName && (
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-300">
              {product.categoryName}
            </span>
          )}
          <span className="text-xs font-mono text-zinc-500">
            SKU: {product.sku}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {product.name}
        </h2>

        {/* Multiple Images Gallery */}
        {(() => {
          const imgList =
            product.images && product.images.length > 0
              ? product.images
              : product.primaryImage
              ? [product.primaryImage]
              : ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"];

          return (
            <div className="my-4 space-y-2">
              <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img
                  src={imgList[activeImgIndex < imgList.length ? activeImgIndex : 0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
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
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImgIndex === i
                          ? "border-indigo-500 scale-105 shadow-md shadow-indigo-500/20"
                          : "border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
          {product.description}
        </p>

        {/* Detailed Specs Table */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Hardware Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs).map(([label, val]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-zinc-500 font-medium">{label}</span>
                  <span className="text-zinc-200 font-semibold mt-0.5">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warranty & Delivery Info */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>3 Years Manufacturer Warranty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Free Express Delivery (Orders &gt; $500)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Factory Sealed &amp; Genuine</span>
          </div>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800">
          <div>
            <span className="text-xs text-zinc-500 block">Unit Price</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Quantity Selector */}
            <div className="flex items-center rounded-xl bg-zinc-800 border border-zinc-700 p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-lg text-zinc-300 hover:bg-zinc-700 flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="w-9 text-center text-sm font-semibold text-white">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-lg text-zinc-300 hover:bg-zinc-700 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              id="quickview-add-to-cart-btn"
              disabled={added}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
              }`}
            >
              {added ? (
                <>
                  <span>✓ Added to Cart</span>
                </>
              ) : (
                <>
                  <span>🛒 Add to Cart</span>
                  <span className="text-indigo-200">
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
