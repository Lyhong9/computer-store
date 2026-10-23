"use client";

import { useEffect, useState, useRef } from "react";
import { BakongQrData, paymentsApi } from "@/services/api";
import { Order } from "@/types/store";

interface BakongKhqrModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export function BakongKhqrModal({
  isOpen,
  order,
  onClose,
  onPaymentSuccess,
}: BakongKhqrModalProps) {
  const [qrData, setQrData] = useState<BakongQrData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState("Waiting for your transfer...");
  const [isSuccess, setIsSuccess] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load KHQR on open
  useEffect(() => {
    if (!isOpen || !order) {
      setQrData(null);
      setTimeLeft(300);
      setIsSuccess(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    paymentsApi
      .generateBakongQr(order.id)
      .then((data) => {
        if (isMounted) {
          setQrData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to generate Bakong KHQR:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, order]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || isSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isSuccess]);

  // Polling for Bakong Open API verification
  useEffect(() => {
    if (!isOpen || !order || isSuccess || timeLeft <= 0) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await paymentsApi.checkBakongStatus(order.id, qrData?.md5Hash);
        if (res.isPaid) {
          setIsSuccess(true);
          setStatusText("Payment verified successfully!");
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

    pollIntervalRef.current = setInterval(checkPayment, 3500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, order, qrData, isSuccess, timeLeft, onPaymentSuccess]);

  // Simulate payment test helper
  const handleSimulatePayment = async () => {
    if (!order) return;
    setIsVerifying(true);
    setStatusText("Verifying transaction...");

    try {
      const res = await paymentsApi.simulateSuccess(order.id, "BAKONG_KHQR");
      if (res.isPaid) {
        setIsSuccess(true);
        setStatusText("Test payment confirmed!");
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

  const handleCopyAccountId = () => {
    const acc = qrData?.accountId || "dam_lyhong@bkrt";
    navigator.clipboard.writeText(acc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 my-4 text-white">
        {/* KHQR Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 font-black text-sm tracking-tighter shadow-sm">
              KHQR
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">Bakong KHQR</h3>
              <p className="text-[11px] text-red-100 font-medium">Scan with any Cambodian Banking App</p>
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
          {/* Merchant & Amount Box */}
          <div className="text-center w-full mb-4">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {qrData?.storeLabel || "POS Store"}
            </p>
            <h4 className="text-lg font-bold text-zinc-100">
              {qrData?.accountName || "DAM LYHONG"}
            </h4>
            <div className="mt-2 py-1 px-4 rounded-full bg-red-500/10 border border-red-500/20 inline-block">
              <span className="text-xs text-red-400 font-bold mr-1">USD</span>
              <span className="text-2xl font-black text-white tracking-tight">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative w-64 h-64 bg-white rounded-2xl p-3 shadow-inner flex items-center justify-center border-4 border-red-500/30">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 text-zinc-500">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-zinc-700">Generating KHQR...</span>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center gap-3 text-emerald-600 animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl font-black">
                  ✓
                </div>
                <span className="text-sm font-extrabold text-zinc-900">Payment Received!</span>
              </div>
            ) : qrData?.qrImageBase64 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrData.qrImageBase64}
                  alt="Bakong KHQR"
                  className="w-full h-full object-contain rounded-lg"
                />
                {/* KHQR Center Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-red-600 border-2 border-white flex items-center justify-center text-white font-black text-[11px] shadow-md">
                  KHQR
                </div>
              </div>
            ) : (
              <div className="text-center p-4 text-zinc-600 text-xs font-medium">
                Unable to load QR image. Please try again or use manual transfer.
              </div>
            )}
          </div>

          {/* Account ID & Copy */}
          <div className="mt-4 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-zinc-500">Account:</span>
              <span className="font-mono text-zinc-200 truncate">{qrData?.accountId || "dam_lyhong@bkrt"}</span>
            </div>
            <button
              onClick={handleCopyAccountId}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[11px] transition-colors shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Real-time Status and Countdown */}
          <div className="mt-4 w-full flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-zinc-300 font-medium">{statusText}</span>
            </div>
            <span className="font-mono font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/40">
              {timeFormatted}
            </span>
          </div>

          {/* Supported Banking Apps list */}
          <div className="mt-5 w-full pt-4 border-t border-zinc-800/80">
            <p className="text-[11px] text-zinc-400 text-center mb-2 font-medium">
              Supported by 50+ Cambodian Banks &amp; Wallets:
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] text-zinc-300 font-bold">
              {["Bakong", "ABA Mobile", "Canadia", "Wing", "ACLEDA", "Sathapana", "Prince"].map((bank) => (
                <span key={bank} className="px-2 py-1 rounded-md bg-zinc-800/70 border border-zinc-700/60">
                  {bank}
                </span>
              ))}
            </div>
          </div>

          {/* Sandbox / Dev Test Action Button */}
          <div className="mt-5 w-full space-y-2">
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isVerifying || isSuccess}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verifying via Bakong Open API...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Simulate Payment Success (Demo / Sandbox)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Pay Later / Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
