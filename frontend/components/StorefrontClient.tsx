"use client";

import React, { useEffect, useState } from "react";
import { Brand, Category, Order, Product } from "@/types/store";
import { DigitaxNavbar } from "./digitax/DigitaxNavbar";
import { DigitaxCategoryIconsBar } from "./digitax/DigitaxCategoryIconsBar";
import { DigitaxHeroBanners } from "./digitax/DigitaxHeroBanners";
import { DigitaxFeatureBadges } from "./digitax/DigitaxFeatureBadges";
import { DigitaxFeaturedGradientSection } from "./digitax/DigitaxFeaturedGradientSection";
import { DigitaxDealsAndProducts } from "./digitax/DigitaxDealsAndProducts";
import { DigitaxShopView } from "./digitax/DigitaxShopView";
import { DigitaxFooter } from "./digitax/DigitaxFooter";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { OrderSuccessModal } from "./OrderSuccessModal";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

interface StorefrontClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  isBackendConnected: boolean;
  defaultTab?: "home" | "shop";
}

export function StorefrontClient({
  initialProducts,
  categories,
  brands,
  isBackendConnected,
  defaultTab = "home",
}: StorefrontClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"home" | "shop">(defaultTab);

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { notificationMessage } = useWishlist();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setActiveTab("shop");
  };

  const handleHeroShopClick = () => {
    setActiveTab("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#080d29] text-white flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#00ff88] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-[#1b74e4] selection:text-white">
      {/* 1. DIGITAX Primary Navbar */}
      <DigitaxNavbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            setActiveTab("shop");
          }
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. Main Content Views (Home or Shop) */}
      <main className="flex-1">
        {activeTab === "home" ? (
          <div>
            {/* Category Icons Row */}
            <DigitaxCategoryIconsBar
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />

            {/* Hero Banners Grid */}
            <DigitaxHeroBanners onShopClick={handleHeroShopClick} />

            {/* 4 Feature Badges Bar */}
            <DigitaxFeatureBadges />

            {/* Featured & Best-Selling Teal-to-Blue Gradient Section */}
            <DigitaxFeaturedGradientSection
              products={initialProducts}
              onQuickView={setQuickViewProduct}
            />

            {/* Today's Best Deals & Product Cards */}
            <DigitaxDealsAndProducts
              products={initialProducts}
              onQuickView={setQuickViewProduct}
              onViewAllClick={() => setActiveTab("shop")}
            />
          </div>
        ) : (
          <DigitaxShopView
            products={initialProducts}
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuickView={setQuickViewProduct}
            onHomeClick={() => setActiveTab("home")}
          />
        )}
      </main>

      {/* 3. DIGITAX Dark Footer */}
      <DigitaxFooter />

      {/* 4. Global Modals & Drawers */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      <WishlistDrawer
        onQuickView={setQuickViewProduct}
        onExploreShop={() => {
          setActiveTab("shop");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Floating Wishlist Toast */}
      {notificationMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
          </div>
          <span>{notificationMessage}</span>
        </div>
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => {
          setIsCheckoutOpen(false);
          setPlacedOrder(order);
        }}
      />

      <OrderSuccessModal
        order={placedOrder}
        onClose={() => setPlacedOrder(null)}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
