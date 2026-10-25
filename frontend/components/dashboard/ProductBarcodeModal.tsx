"use client";

import React, { useState } from "react";
import {
  Printer,
  X,
  Barcode as BarcodeIcon,
  QrCode,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import { Product } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductBarcodeModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductBarcodeModal({
  product,
  isOpen,
  onClose,
}: ProductBarcodeModalProps) {
  const [copies, setCopies] = useState<number>(4);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  const copySku = () => {
    navigator.clipboard.writeText(product.sku || String(product.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate simulated Code-128 SVG barcode bars based on SKU string
  const renderBarcodeBars = (str: string) => {
    const chars = str.split("");
    return (
      <div className="flex items-stretch justify-center h-12 w-full gap-[2px] px-2 bg-white">
        {chars.map((ch, idx) => {
          const code = ch.charCodeAt(0);
          const isWide = code % 2 === 0;
          const isDouble = (code * 3) % 5 === 0;
          return (
            <React.Fragment key={idx}>
              <div
                className={`bg-slate-900 ${
                  isDouble ? "w-1.5" : isWide ? "w-1" : "w-0.5"
                } h-full`}
              />
              <div
                className={`${
                  (code + idx) % 3 === 0 ? "w-1" : "w-0.5"
                } h-full bg-white`}
              />
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 my-8 overflow-hidden flex flex-col">
        {/* Controls Header (Hidden on print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <BarcodeIcon className="w-4 h-4" />
            </span>
            <div>
              <span className="font-extrabold text-sm text-slate-800 dark:text-zinc-200 block">
                Warehouse SKU & Barcode Labels
              </span>
              <span className="text-[11px] text-slate-400">
                {product.name} ({product.sku})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2 text-xs text-slate-600 dark:text-zinc-400 font-semibold">
              <span>Quantity:</span>
              <select
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs outline-none"
              >
                <option value={1}>1 Label</option>
                <option value={2}>2 Labels</option>
                <option value={4}>4 Labels (Sheet)</option>
                <option value={8}>8 Labels</option>
                <option value={12}>12 Labels</option>
              </select>
            </div>

            <Button
              onClick={handlePrint}
              size="sm"
              className="h-8 px-3.5 text-xs font-bold gap-1.5 bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Labels</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Printable Labels Grid                                        */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-8 bg-slate-100/60 dark:bg-zinc-950 print:bg-white print:p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {[...Array(copies)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between text-slate-900 print:shadow-none print:border-slate-300"
              >
                {/* Label Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase text-purple-600">
                      TechShop Hardware
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                      {product.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {product.categoryName || "Hardware"} • {product.brandName || "TechShop"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900 block">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600">
                      Stock: {product.quantityOnHand}
                    </span>
                  </div>
                </div>

                {/* Barcode Graphic */}
                <div className="py-2 flex flex-col items-center justify-center">
                  {renderBarcodeBars(product.sku || `SKU-${product.id}`)}
                  <span className="font-mono text-xs font-bold text-slate-700 tracking-widest mt-1">
                    *{product.sku || product.id}*
                  </span>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-medium">
                  <span>Authentic Certified</span>
                  <span className="font-mono">ID #{product.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="print:hidden px-6 py-3 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#111827] flex items-center justify-between text-xs">
          <button
            onClick={copySku}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 font-semibold"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "SKU Copied!" : `Copy SKU: ${product.sku}`}</span>
          </button>

          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
