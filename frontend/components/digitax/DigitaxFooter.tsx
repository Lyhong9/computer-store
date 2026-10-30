"use client";

import React from "react";
import { Headphones, Phone, MapPin, Mail, ArrowUp, QrCode, ShieldCheck } from "lucide-react";

export function DigitaxFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#050811] text-slate-400 border-t border-slate-800/80 pt-14 pb-10 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/60">
          {/* Col 1 & 2: Support & Contact Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-sm shadow-sm">
                24/7
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
                  Bakong & Technical Support
                </span>
                <span className="text-base sm:text-lg font-black text-blue-400 tracking-tight">
                  +855 96 899 9414
                </span>
              </div>
            </div>

            <div className="text-xs space-y-2 pt-2 text-slate-400 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Russian Federation Blvd, Setec Institute, Phnom Penh, Cambodia</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>support@digitax.com.kh</span>
              </p>
              <p className="flex items-center gap-2 text-emerald-400 pt-1">
                <QrCode className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-slate-300">Official Bakong KHQR Instant Checkout Partner</span>
              </p>
            </div>
          </div>

          {/* Col 3: Store Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Branch Stores
            </h4>
            <ul className="text-xs space-y-2.5">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Phnom Penh Flagship - Cambodia
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Siem Reap TechHub - Cambodia
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Battambang Express - Cambodia
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Bangkok Hub - Thailand
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Customer Services
            </h4>
            <ul className="text-xs space-y-2.5">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Bakong KHQR Payment Guide
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                3-Year Warranty Claims
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Track My Delivery
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Privacy & Data Security
              </li>
            </ul>
          </div>

          {/* Col 5: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Quick Links
            </h4>
            <ul className="text-xs space-y-2.5">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Storefront Catalog
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Customer Profile Dashboard
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Saved Wishlist
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">
                Today's Best Deals
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DIGITAX PRO Computer Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Secured by KHQR & Spring Boot
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

