"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import QRCode from "qrcode";
import { BakongQrData, paymentsApi } from "@/services/api";
import { Order } from "@/types/store";
import { playPaymentSuccessSound } from "@/lib/sound";

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
  const [cleanQrImage, setCleanQrImage] = useState<string>("");
  const [qrMode, setQrMode] = useState<"dynamic" | "static">("dynamic");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes matching EMV Tag 99
  const [copied, setCopied] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState("Listening for phone transfer & scan...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifiedTxHash, setVerifiedTxHash] = useState<string>("");

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Static KHQR EMV payload for dam_lyhong@bkrt (Standard NBC Individual Merchant)
  const staticKhqrString = useMemo(() => {
    return "00020101021129290015dam_lyhong@bkrt0206Bakong5204599953038405802KH5910DAM LYHONG6010Phnom Penh62230309POS Store0706POS-016304CCD0";
  }, []);

  // Generate crisp QR code whenever qrData or qrMode changes
  useEffect(() => {
    const rawString = qrMode === "dynamic" ? qrData?.qrString : staticKhqrString;
    if (rawString) {
      QRCode.toDataURL(rawString, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 480,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then((url) => setCleanQrImage(url))
        .catch(() => {
          if (qrData?.qrImageBase64) setCleanQrImage(qrData.qrImageBase64);
        });
    }
  }, [qrData, qrMode, staticKhqrString]);

  // Load KHQR on open
  useEffect(() => {
    if (!isOpen || !order) {
      setQrData(null);
      setCleanQrImage("");
      setTimeLeft(900);
      setIsSuccess(false);
      setVerifiedTxHash("");
      isTriggeredRef.current = false;
      return;
    }

    isTriggeredRef.current = false;
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

  const isTriggeredRef = useRef(false);

  // Countdown timer (independent of polling)
  useEffect(() => {
    if (!isOpen || isSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);

  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete and close modal
  const completeSuccess = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (order) {
      onPaymentSuccess({
        ...order,
        status: "CONFIRMED",
        paymentMethod: "BAKONG_KHQR",
      });
    }
  }, [order, onPaymentSuccess]);

  // Handle dismissal (if already paid, completes and closes properly)
  const handleDismiss = useCallback(() => {
    if (isSuccess) {
      completeSuccess();
    } else {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      onClose();
    }
  }, [isSuccess, completeSuccess, onClose]);

  // Handle successful payment trigger
  const handleSuccessTrigger = useCallback(
    (txHash?: string) => {
      if (isTriggeredRef.current) return;
      isTriggeredRef.current = true;

      setIsSuccess(true);
      if (txHash) setVerifiedTxHash(txHash);
      setStatusText("Payment verified & received!");
      playPaymentSuccessSound();

      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      // Fast auto-close in 1.2s to smoothly dismiss modal
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        completeSuccess();
      }, 1200);
    },
    [completeSuccess]
  );

  // Manual Check Payment button
  const handleCheckNow = async () => {
    if (!order || isVerifying || isSuccess) return;
    setIsVerifying(true);
    setStatusText("Verifying with NBC Bakong Open API...");

    try {
      const res = await paymentsApi.checkBakongStatus(order.id, qrData?.md5Hash);
      if (res.isPaid) {
        handleSuccessTrigger(res.transactionId || qrData?.md5Hash);
      } else {
        setStatusText(res.message || "Transfer not found yet. Please check your phone.");
        setTimeout(() => {
          if (!isSuccess) setStatusText("Listening for phone transfer & scan...");
        }, 3000);
      }
    } catch (e) {
      setStatusText("Verification check timed out. Retrying...");
    } finally {
      setIsVerifying(false);
    }
  };

  // High-frequency Polling for Bakong Open API verification (every 1.5s)
  // CRITICAL: Do NOT include timeLeft in dependencies so interval is not destroyed every second!
  useEffect(() => {
    if (!isOpen || !order || isSuccess) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    let isChecking = false;

    const checkPayment = async () => {
      if (isChecking || isSuccess || isTriggeredRef.current) return;
      isChecking = true;
      try {
        const res = await paymentsApi.checkBakongStatus(order.id, qrData?.md5Hash);
        if (res.isPaid) {
          handleSuccessTrigger(res.transactionId || qrData?.md5Hash);
        }
      } catch (e) {
        // Continue polling silently
      } finally {
        isChecking = false;
      }
    };

    // 1. Immediate check as soon as order/modal is ready
    checkPayment();

    // 2. Poll every 1.5 seconds
    pollIntervalRef.current = setInterval(checkPayment, 1500);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isOpen, order?.id, qrData?.md5Hash, isSuccess, handleSuccessTrigger]);

  // Simulate payment test helper
  const handleSimulatePayment = async () => {
    if (!order) return;
    setIsVerifying(true);
    setStatusText("Verifying transaction...");

    try {
      const res = await paymentsApi.simulateSuccess(order.id, "BAKONG_KHQR");
      if (res.isPaid) {
        handleSuccessTrigger(res.transactionId || "SIMULATED-NBC-OK");
      } else {
        handleSuccessTrigger("SIMULATED-NBC-OK");
      }
    } catch {
      handleSuccessTrigger("SIMULATED-LOCAL-OK");
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
      <div className="fixed inset-0" onClick={handleDismiss} aria-hidden="true" />

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
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-sm font-bold text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          /* Rich Payment Success Celebration Screen */
          <div className="p-7 flex flex-col items-center text-center animate-fade-in">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-4xl font-black animate-bounce shadow-xl shadow-emerald-500/30">
                ✓
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              Payment Confirmed!
            </h3>
            <p className="text-xs text-emerald-400 font-medium mt-1">
              Verified by National Bank of Cambodia (Bakong)
            </p>

            <div className="mt-5 w-full bg-zinc-950 rounded-2xl p-4 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Amount Paid:</span>
                <span className="text-base font-black text-white font-mono">
                  ${Number(order.total).toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Store / Terminal:</span>
                <span className="text-zinc-200 font-semibold">{qrData?.storeLabel || "POS Store"} &bull; POS-01</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Account Receiver:</span>
                <span className="text-zinc-200 font-semibold">{qrData?.accountName || "DAM LYHONG"}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Gateway Status:</span>
                <span className="font-bold text-emerald-400 uppercase tracking-wider">PAID &bull; SUCCESS</span>
              </div>
              {verifiedTxHash && (
                <div className="flex justify-between items-center text-zinc-400 pt-1 border-t border-zinc-850">
                  <span>Ref Hash:</span>
                  <span className="font-mono text-[10px] text-zinc-300 truncate max-w-[170px]">
                    {verifiedTxHash}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 w-full space-y-2">
              <button
                type="button"
                onClick={completeSuccess}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Done &amp; Close Modal</span>
                <span>&rarr;</span>
              </button>
              <p className="text-[11px] text-emerald-400/80 font-medium animate-pulse">
                Closing automatically in 1 second...
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center">
            {/* Mode Switcher: Dynamic vs Static */}
            <div className="w-full flex rounded-xl bg-zinc-950 p-1 mb-4 border border-zinc-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setQrMode("dynamic")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  qrMode === "dynamic"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Dynamic KHQR ($0.10)
              </button>
              <button
                type="button"
                onClick={() => setQrMode("static")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  qrMode === "static"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Static Account QR
              </button>
            </div>

            {/* Merchant & Amount Box */}
            <div className="text-center w-full mb-3">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                {qrData?.storeLabel || "POS Store"} &bull; Bank: Bakong
              </p>
              <h4 className="text-base font-bold text-zinc-100">
                {qrData?.accountName || "DAM LYHONG"}
              </h4>
              <div className="mt-1.5 py-1 px-4 rounded-full bg-red-500/10 border border-red-500/20 inline-block">
                <span className="text-xs text-red-400 font-bold mr-1">USD</span>
                <span className="text-2xl font-black text-white tracking-tight">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
              {qrMode === "static" && (
                <p className="text-[11px] text-amber-400 font-medium mt-1">
                  Permanent Account QR &bull; Enter $0.10 in your banking app
                </p>
              )}
            </div>

            {/* QR Code Container - Pure and Unobstructed */}
            <div className="relative w-64 h-64 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center border-4 border-red-500/40">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                  <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-zinc-700">Generating Compliant KHQR...</span>
                </div>
              ) : cleanQrImage || qrData?.qrImageBase64 ? (
                <div className="w-full h-full flex items-center justify-center">
                  {/* Clean, high-contrast QR with NO overlay blocking center pixels */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cleanQrImage || qrData?.qrImageBase64}
                    alt="Bakong KHQR"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center p-4 text-zinc-600 text-xs font-medium">
                  Unable to load QR image. Please try again or use manual transfer.
                </div>
              )}
            </div>

            {/* Account ID & Copy */}
            <div className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-zinc-500">Account:</span>
                <span className="font-mono text-zinc-200 truncate">{qrData?.accountId || "dam_lyhong@bkrt"}</span>
              </div>
              <button
                onClick={handleCopyAccountId}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[11px] transition-colors shrink-0"
              >
                {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>

            {/* Copy Raw KHQR String */}
            <div className="mt-2 w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-950/60 border border-zinc-850 text-[11px]">
              <span className="text-zinc-500 truncate mr-2 font-mono">
                {((qrMode === "dynamic" ? qrData?.qrString : staticKhqrString) || "").slice(0, 28)}...
              </span>
              <button
                onClick={() => {
                  const str = qrMode === "dynamic" ? qrData?.qrString : staticKhqrString;
                  if (str) {
                    navigator.clipboard.writeText(str);
                    setCopiedQr(true);
                    setTimeout(() => setCopiedQr(false), 2000);
                  }
                }}
                className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white font-medium text-[10px] shrink-0"
              >
                {copiedQr ? "Copied String!" : "Copy KHQR"}
              </button>
            </div>

            {/* Real-time Status and Countdown */}
            <div className="mt-3 w-full flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-zinc-300 font-medium">{statusText}</span>
              </div>
              {qrMode === "dynamic" && (
                <span className="font-mono font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/40">
                  {timeFormatted}
                </span>
              )}
            </div>

            {/* Supported Banking Apps list */}
            <div className="mt-4 w-full pt-3 border-t border-zinc-800/80">
              <p className="text-[11px] text-zinc-400 text-center mb-2 font-medium">
                Supported by 50+ Cambodian Banks &amp; Wallets:
              </p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] text-zinc-300 font-bold">
                {["Bakong", "ABA Mobile", "Canadia", "Wing", "ACLEDA", "Sathapana", "Prince"].map((bank) => (
                  <span key={bank} className="px-2 py-0.5 rounded-md bg-zinc-800/70 border border-zinc-700/60">
                    {bank}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: Check Payment Now + Simulate Fallback */}
            <div className="mt-5 w-full space-y-2">
              <button
                type="button"
                id="pos-check-payment-btn"
                onClick={handleCheckNow}
                disabled={isVerifying || isSuccess}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying with NBC Open API...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>Check Payment Status Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isVerifying || isSuccess}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>⚡</span>
                <span>Simulate Payment Success (Demo / Sandbox)</span>
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
        )}
      </div>
    </div>
  );
}
