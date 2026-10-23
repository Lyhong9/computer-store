"use client";

import { useEffect, useState, useRef } from "react";
import { AbaCheckoutPayload, paymentsApi } from "@/services/api";
import { Order } from "@/types/store";

interface AbaPaywayModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export function AbaPaywayModal({
  isOpen,
  order,
  onClose,
  onPaymentSuccess,
}: AbaPaywayModalProps) {
  const [payload, setPayload] = useState<AbaCheckoutPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState("Waiting for ABA PayWay confirmation...");
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen || !order) {
      setPayload(null);
      setIsSuccess(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    paymentsApi
      .createAbaCheckout(order.id)
      .then((data) => {
        if (isMounted) {
          setPayload(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to create ABA PayWay checkout:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, order]);

  // Polling for ABA PayWay status
  useEffect(() => {
    if (!isOpen || !order || isSuccess) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await paymentsApi.checkAbaStatus(order.id);
        if (res.isPaid) {
          setIsSuccess(true);
          setStatusText("Payment verified via ABA PayWay!");
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setTimeout(() => {
            onPaymentSuccess({
              ...order,
              status: "CONFIRMED",
            });
          }, 1200);
        }
      } catch (e) {
        // Continue polling
      }
    };

    pollIntervalRef.current = setInterval(checkPayment, 4000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, order, isSuccess, onPaymentSuccess]);

  const handleOpenAbaCheckout = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleSimulatePayment = async () => {
    if (!order) return;
    setIsVerifying(true);
    setStatusText("Verifying ABA transaction...");

    try {
      const res = await paymentsApi.simulateSuccess(order.id, "ABA_PAYWAY");
      if (res.isPaid) {
        setIsSuccess(true);
        setStatusText("ABA PayWay payment confirmed!");
        setTimeout(() => {
          setIsVerifying(false);
          onPaymentSuccess({
            ...order,
            status: "CONFIRMED",
          });
        }, 1000);
      }
    } catch (err) {
      setIsVerifying(false);
      setStatusText("Simulation failed. Try again.");
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 my-4 text-white">
        {/* ABA Header */}
        <div className="bg-[#003366] px-6 py-4 flex items-center justify-between text-white shadow-md border-b border-[#002244]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#003366] font-black text-sm tracking-tight shadow-sm">
              ABA
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">ABA PayWay Gateway</h3>
              <p className="text-[11px] text-cyan-200 font-medium">Sandbox Checkout &amp; Card Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-sm font-bold text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* Order Details Card */}
          <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 mb-4 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Merchant ID:</span>
              <span className="font-mono font-bold text-zinc-200">{payload?.merchantId || "ec477591"}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Order Number:</span>
              <span className="font-mono font-bold text-zinc-200">{order.id}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Customer:</span>
              <span className="font-semibold text-zinc-200">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800/60 font-bold">
              <span className="text-sm text-zinc-300">Amount Due:</span>
              <span className="text-xl font-black text-cyan-400">
                ${Number(order.total).toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-zinc-300 font-medium">{statusText}</span>
          </div>

          {/* Hidden Form for ABA PayWay Submission */}
          {payload && (
            <form
              ref={formRef}
              action={payload.purchaseUrl}
              method="POST"
              target="_blank"
              className="hidden"
            >
              {Object.entries(payload.formData).map(([key, val]) => (
                <input key={key} type="hidden" name={key} value={val} />
              ))}
            </form>
          )}

          {/* Action Buttons */}
          <div className="w-full space-y-2.5">
            <button
              type="button"
              onClick={handleOpenAbaCheckout}
              disabled={isLoading || isSuccess}
              className="w-full py-3 px-4 rounded-xl bg-[#005599] hover:bg-[#004480] text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Preparing ABA Gateway...</span>
                </>
              ) : (
                <>
                  <span>💳</span>
                  <span>Proceed to ABA PayWay Gateway (Sandbox)</span>
                  <span>↗</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isVerifying || isSuccess}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verifying via ABA PayWay...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Simulate ABA Payment Success (Demo / Sandbox)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel / Pay Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
