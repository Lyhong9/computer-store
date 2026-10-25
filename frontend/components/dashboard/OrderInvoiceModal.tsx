"use client";

import React, { useRef } from "react";
import {
  Printer,
  X,
  CheckCircle2,
  Download,
  Building2,
  Calendar,
  CreditCard,
  QrCode,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Order } from "@/types/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderInvoiceModal({
  order,
  isOpen,
  onClose,
}: OrderInvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const exchangeRate = 4100;
  const totalKhr = Math.round((order.total || 0) * exchangeRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 my-8 overflow-hidden flex flex-col">
        {/* Modal Controls Top Bar (Hidden on print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Printer className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">
              Official Tax Invoice / Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="h-8 px-3.5 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
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
        {/* Printable Invoice Document Body                              */}
        {/* ============================================================ */}
        <div
          ref={invoiceRef}
          className="p-8 sm:p-10 space-y-8 bg-white text-slate-900 print:p-0 print:m-0 print:shadow-none"
        >
          {/* Header & Company Brand */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                  T
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">
                    TechShop Hardware
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Premium Computer & Hardware Ecommerce
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                <p>Street 315, Toul Kork, Phnom Penh, Cambodia</p>
                <p>Phone: +855 23 888 999 | Email: orders@techshop.kh</p>
                <p className="font-mono text-[11px] text-slate-400">VAT Reg: K009-84729103</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider mb-1">
                Commercial Invoice
              </div>
              <p className="text-xs text-slate-400 font-semibold">Invoice No:</p>
              <p className="font-mono text-sm sm:text-base font-black text-slate-800">
                INV-{order.id.replace(/^ORD-/, "")}
              </p>
              <p className="text-xs text-slate-500">
                Date: <span className="font-semibold text-slate-700">{formatDate(order.createdAt)}</span>
              </p>
            </div>
          </div>

          {/* Billing & Shipping Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                Customer Details
              </p>
              <p className="font-extrabold text-sm text-slate-900">{order.customerName}</p>
              <p className="text-slate-600 mt-0.5">{order.customerEmail}</p>
              <p className="text-slate-600">{order.customerPhone || "N/A"}</p>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                Shipping & Payment
              </p>
              <p className="text-slate-700 font-medium line-clamp-2">
                {order.shippingAddress || "Store Pickup / Local Delivery"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-slate-600">Payment:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {order.paymentMethod || "Bakong KHQR"}
                </span>
                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Paid
                </span>
              </div>
              {order.trackingNumber && (
                <p className="mt-1.5 text-slate-600">
                  <span className="font-bold">Tracking ({order.carrier || "Courier"}):</span>{" "}
                  <span className="font-mono font-bold text-blue-600">{order.trackingNumber}</span>
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Item & Specifications</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center w-16">Qty</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{it.product.name}</p>
                      <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                        SKU: {it.product.sku || "N/A"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      {formatCurrency(it.product.price)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {it.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {formatCurrency(it.product.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Signatures */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-2">
            {/* Notes & KHQR seal */}
            <div className="space-y-3 max-w-sm text-xs text-slate-500">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Official electronic invoice generated by TechShop POS. All parts guaranteed original with manufacturer warranty.
                </p>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Thank you for choosing TechShop! For support or returns, contact support@techshop.kh within 7 days.
              </p>
            </div>

            {/* Calculations */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(order.subtotal || order.total * 0.92)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>VAT / Tax (8%):</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(order.tax || order.total * 0.08)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Shipping:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-extrabold text-sm text-slate-900">Total Due:</span>
                  <span className="font-black text-xl text-blue-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-0.5">
                  <span>KHR Equivalent:</span>
                  <span className="font-bold text-slate-600">{totalKhr.toLocaleString()} ៛</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Signature line for physical copy */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-400">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mx-6 mb-2"></div>
              <p className="font-bold text-slate-600">Customer Signature</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mx-6 mb-2"></div>
              <p className="font-bold text-slate-600">Authorized TechShop Signature & Stamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
