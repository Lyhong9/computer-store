"use client";

import React, { useRef } from "react";
import {
  Printer,
  Download,
  CheckCircle2,
  X,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Order } from "@/types/store";

interface PosReceiptModalProps {
  isOpen: boolean;
  order: Order | null;
  cashierName?: string;
  onClose: () => void;
  onNewTransaction: () => void;
}

export function PosReceiptModal({
  isOpen,
  order,
  cashierName = "Dam Lyhong (Cashier #01)",
  onClose,
  onNewTransaction,
}: PosReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !order) return null;

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = orderDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const lines = [
      "========================================",
      "          TECHSHOP COMPUTER & POS       ",
      "      Russian Blvd, Phnom Penh, KH      ",
      "          Tel: +855 96 899 9414         ",
      "========================================",
      `Receipt No : ${order.id}`,
      `Date       : ${formattedDate} ${formattedTime}`,
      `Cashier    : ${cashierName}`,
      `Customer   : ${order.customerName || "Walk-in Customer"}`,
      `Payment    : ${order.paymentMethod || "Bakong KHQR"}`,
      `Status     : PAID / VERIFIED (NBC)`,
      "----------------------------------------",
      "ITEM                          QTY  TOTAL",
      "----------------------------------------",
    ];

    order.items.forEach((item) => {
      const name = (item.product.name || "Product").padEnd(24, " ").slice(0, 24);
      const qty = String(item.quantity).padStart(3, " ");
      const price = `$${(item.product.price * item.quantity).toFixed(2)}`.padStart(8, " ");
      lines.push(`${name} ${qty} ${price}`);
      if (item.product.sku) {
        lines.push(`  SKU: ${item.product.sku}`);
      }
    });

    lines.push("----------------------------------------");
    lines.push(`Subtotal:                  $${Number(order.subtotal || order.total).toFixed(2)}`);
    lines.push(`Tax / VAT (0% POS):        $${Number(order.tax || 0).toFixed(2)}`);
    lines.push(`TOTAL PAID:                $${Number(order.total).toFixed(2)} USD`);
    lines.push("========================================",
      "     30 DAYS HARDWARE WARRANTY INCL     ",
      "  Thank you for shopping at TechShop!   ",
      "========================================"
    );

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TechShop-Receipt-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Background click to close */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      {/* Main Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-4 text-zinc-900 dark:text-zinc-100 print:border-none print:shadow-none print:rounded-none print:max-w-none print:m-0 print:bg-white print:text-black">
        {/* Top Success Ribbon (Screen Only) */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold backdrop-blur-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Payment Success!
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                Verified via {order.paymentMethod === "ABA_PAYWAY" ? "ABA PayWay" : "Bakong KHQR (NBC)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-sm font-bold text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Action Header Bar (Screen Only) */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="pos-print-receipt-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print (80mm)</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Slip</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onNewTransaction}
            className="px-3.5 py-1.5 rounded-xl bg-[#c6f052] hover:bg-[#b5e042] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Next Customer</span>
          </button>
        </div>

        {/* Printable Thermal Receipt Body */}
        <div
          ref={receiptRef}
          id="printable-receipt"
          className="p-6 sm:p-7 font-mono text-xs bg-white text-zinc-900 border-x border-dashed border-zinc-300 mx-auto max-w-[380px] print:w-[80mm] print:max-w-none print:p-2 print:border-none"
        >
          {/* Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-dashed border-zinc-400">
            <div className="inline-flex items-center justify-center gap-1.5 font-black text-lg tracking-tight text-zinc-950 uppercase">
              <ShoppingBag className="w-5 h-5 text-emerald-600 print:hidden" />
              <span>TECHSHOP COMPUTER</span>
            </div>
            <p className="text-[11px] text-zinc-600">POS &amp; Hardware Retail Store</p>
            <p className="text-[10px] text-zinc-500">Russian Federation Blvd (110), Phnom Penh</p>
            <p className="text-[10px] text-zinc-500">Tel: +855 96 899 9414 &bull; VAT: K008-94821</p>
          </div>

          {/* Transaction Metadata */}
          <div className="py-3 space-y-1 text-[11px] border-b border-dashed border-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Receipt No:</span>
              <span className="font-bold text-zinc-900">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Date/Time:</span>
              <span className="text-zinc-800">
                {formattedDate} {formattedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Cashier:</span>
              <span className="text-zinc-800">{cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer:</span>
              <span className="text-zinc-800">{order.customerName || "Walk-in Customer"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Terminal:</span>
              <span className="text-zinc-800">POS-01 (In-Store)</span>
            </div>
          </div>

          {/* Items Header */}
          <div className="pt-3 pb-1 border-b border-zinc-400 font-bold text-[11px] flex justify-between uppercase">
            <span>Item / Qty</span>
            <span>Total</span>
          </div>

          {/* Line Items List */}
          <div className="py-2 space-y-2 border-b border-dashed border-zinc-300">
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-bold text-zinc-900">
                  <span className="truncate pr-2">{item.product.name}</span>
                  <span className="shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>
                    {item.quantity} x ${item.product.price.toFixed(2)}
                    {item.product.sku ? ` &bull; SKU: ${item.product.sku}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="py-3 space-y-1.5 text-[11px] border-b-2 border-dashed border-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subtotal:</span>
              <span className="font-bold">${Number(order.subtotal || order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">POS Discount (0%):</span>
              <span className="text-zinc-500">-$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">VAT / Tax (POS Waived):</span>
              <span className="text-zinc-500">$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-sm font-black border-t border-zinc-300 text-zinc-950">
              <span className="tracking-tight uppercase">TOTAL PAID:</span>
              <span className="text-base text-emerald-700 font-mono">
                ${Number(order.total).toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Payment & Gateway Verification */}
          <div className="py-3 space-y-1 text-[10px] bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Payment Gateway:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {order.paymentMethod === "ABA_PAYWAY"
                  ? "ABA PayWay"
                  : "Bakong KHQR (NBC Transfer)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Payment Status:</span>
              <span className="font-bold text-emerald-600 uppercase">PAID &bull; VERIFIED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Approval Auth:</span>
              <span className="font-mono text-zinc-700">NBC-OK-{order.id.slice(-6)}</span>
            </div>
          </div>

          {/* Simulated Barcode */}
          <div className="mt-4 pt-3 text-center space-y-1">
            <div className="flex justify-center items-center gap-0.5 h-10 overflow-hidden px-4">
              {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2].map(
                (w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                )
              )}
            </div>
            <p className="text-[9px] tracking-widest text-zinc-500 uppercase font-mono">
              *{order.id}*
            </p>
          </div>

          {/* Footer & Warranty Notice */}
          <div className="mt-4 text-center space-y-1 pt-3 border-t border-dashed border-zinc-300 text-[10px] text-zinc-500">
            <p className="font-bold text-zinc-800">30-DAY HARDWARE WARRANTY INCLUDED</p>
            <p>Exchange or repair valid with original printed or digital receipt.</p>
            <p className="text-zinc-400">www.techshop.kh &bull; support@techshop.kh</p>
            <p className="font-bold text-zinc-800 pt-1">THANK YOU FOR YOUR BUSINESS!</p>
          </div>
        </div>

        {/* Bottom CTA for POS Cashier (Screen Only) */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onNewTransaction}
            className="flex-1 py-3 px-4 rounded-xl bg-[#c6f052] hover:bg-[#b5e042] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#c6f052]/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Next Customer / Ready New Sale</span>
          </button>
        </div>
      </div>
    </div>
  );
}
