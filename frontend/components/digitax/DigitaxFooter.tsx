"use client";

import React from "react";
import { Headphones, Phone, MapPin, Mail, ArrowUp } from "lucide-react";

export function DigitaxFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#070a14] text-slate-400 border-t border-slate-800/80 pt-12 pb-8 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800/60">
          {/* Col 1 & 2: Support & Contact Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-sm">
                24/7
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
                  Got questions? Call us 24/7
                </span>
                <span className="text-base sm:text-lg font-black text-blue-400 tracking-tight">
                  (800) 345-8588, (800) 333-8888
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 pt-2 text-slate-400 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>5611 Wellington Road, Suite 115, Gainesville, VA 20155</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>digitax@example.com</span>
              </p>
            </div>
          </div>

          {/* Col 3: Store Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Store Location
            </h4>
            <ul className="text-xs space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">
                Los Angeles - USA
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                New York - USA
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                California - USA
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Bangkok - Thailand
              </li>
            </ul>
          </div>

          {/* Col 4: Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Information
            </h4>
            <ul className="text-xs space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">
                About Us
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Contact Us
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                All Collections
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* Col 5: Extras */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Extras
            </h4>
            <ul className="text-xs space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">
                Contact Us
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Wishlist
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Shopping Cart
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Shipping & Return
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 DIGITAX Ecommerce Store. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
