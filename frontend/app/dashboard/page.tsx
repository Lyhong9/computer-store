"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  DashboardSidebar,
  DashboardSection,
} from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverviewTab } from "@/components/dashboard/DashboardOverviewTab";
import { DashboardProductsTab } from "@/components/dashboard/DashboardProductsTab";
import { DashboardOrdersTab } from "@/components/dashboard/DashboardOrdersTab";
import { DashboardCategoriesTab } from "@/components/dashboard/DashboardCategoriesTab";
import { DashboardBrandsTab } from "@/components/dashboard/DashboardBrandsTab";
import { DashboardCustomersTab } from "@/components/dashboard/DashboardCustomersTab";
import { DashboardFinancesTab } from "@/components/dashboard/DashboardFinancesTab";
import { DashboardSettingsTab } from "@/components/dashboard/DashboardSettingsTab";
import { DashboardPosTab } from "@/components/dashboard/DashboardPosTab";

export default function DashboardPage() {
  const { orders, updateOrderStatus } = useCart();
  const [activeSection, setActiveSection] = useState<DashboardSection>("pos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Sync tab from URL if present (e.g. /dashboard?tab=overview or /dashboard?tab=pos)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as DashboardSection;
      if (tab) {
        setActiveSection(tab);
      }
    }
  }, []);

  const handleOpenAddProduct = () => {
    setActiveSection("products");
    setIsAddProductModalOpen(true);
  };

  return (
    <div className="min-h-screen flex font-sans bg-background text-foreground antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Left Sidebar */}
      <DashboardSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        orderCount={orders.length || 12}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50/50 dark:bg-[#090d16]">
        {/* Top Header - shown on regular dashboard tabs */}
        {activeSection !== "pos" && (
          <DashboardHeader
            onAddProduct={handleOpenAddProduct}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Tab Content Body */}
        <main
          className={`flex-1 ${
            activeSection === "pos"
              ? "p-2 sm:p-4 lg:p-6 max-w-[1750px]"
              : "p-4 sm:p-6 lg:p-8 max-w-7xl"
          } w-full mx-auto space-y-6`}
        >
          {activeSection === "pos" && <DashboardPosTab />}

          {activeSection === "dashboard" && (
            <DashboardOverviewTab
              onAddProduct={handleOpenAddProduct}
              orderCount={orders.length || 46}
            />
          )}

          {activeSection === "products" && (
            <DashboardProductsTab
              isModalOpen={isAddProductModalOpen}
              setIsModalOpen={setIsAddProductModalOpen}
            />
          )}

          {activeSection === "orders" && (
            <DashboardOrdersTab
              orders={orders}
              onUpdateStatus={updateOrderStatus}
            />
          )}

          {activeSection === "categories" && <DashboardCategoriesTab />}

          {activeSection === "brands" && <DashboardBrandsTab />}

          {activeSection === "customers" && <DashboardCustomersTab />}

          {(activeSection === "invoices" ||
            activeSection === "transactions" ||
            activeSection === "reports" ||
            activeSection === "analytics") && (
            <DashboardFinancesTab type={activeSection} />
          )}

          {(activeSection === "settings" || activeSection === "discounts") && (
            <DashboardSettingsTab section={activeSection} />
          )}

          {activeSection === "content" && (
            <div className="p-8 text-center text-slate-500">
              <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">
                Content Management CMS
              </h2>
              <p className="text-xs mt-1">
                Manage promotional homepage banners, announcement tickers, and customer reviews.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
