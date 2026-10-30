"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
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
import { DashboardCustomerAccount } from "@/components/dashboard/DashboardCustomerAccount";
import { DashboardContentTab } from "@/components/dashboard/DashboardContentTab";

export default function DashboardPage() {
  const { orders, updateOrderStatus } = useCart();
  const { isCustomer, isAdmin, effectiveRole } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>("pos");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Sync tab from URL if present (e.g. /dashboard?tab=overview or /dashboard?tab=pos)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as DashboardSection;
      if (tab) {
        setActiveSection(tab);
      }
    }
  }, []);

  // Sync default view when switching between Admin and Customer roles
  useEffect(() => {
    if (isCustomer && activeSection !== "account") {
      setActiveSection("account");
    }
  }, [isCustomer, activeSection]);

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
        {/* Top Header - shown on regular dashboard tabs or whenever user is customer */}
        {(activeSection !== "pos" || isCustomer) && (
          <DashboardHeader
            onAddProduct={handleOpenAddProduct}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigate={(sec) => setActiveSection(sec)}
          />
        )}

        {/* Tab Content Body */}
        <main
          className={`flex-1 ${
            activeSection === "pos" && !isCustomer
              ? "p-2 sm:p-4 lg:p-6 max-w-[1750px]"
              : "p-4 sm:p-6 lg:p-8 max-w-7xl"
          } w-full mx-auto space-y-6`}
        >
          {/* Customer View */}
          {isCustomer || activeSection === "account" ? (
            <DashboardCustomerAccount />
          ) : (
            /* Admin Views */
            <>
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

              {activeSection === "content" && <DashboardContentTab />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
