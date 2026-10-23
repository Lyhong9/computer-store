"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  ShoppingBag,
  PackageCheck,
  Clock,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Eye,
  RefreshCw,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customerApi, CustomerProfile } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export function DashboardCustomerAccount() {
  const { user: authUser } = useAuth();
  const { orders: allOrders } = useCart();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await customerApi.getMe();
      setProfile(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setCity(data.city || "");
    } catch (err: any) {
      if (authUser) {
        setProfile({
          id: authUser.customerId || 0,
          userId: authUser.id,
          username: authUser.username,
          email: authUser.email,
          firstName: authUser.firstName || "Customer",
          lastName: authUser.lastName || "",
          phone: authUser.phone || "",
          address: authUser.address || "",
          city: authUser.city || "Phnom Penh",
        });
        setFirstName(authUser.firstName || "Customer");
        setLastName(authUser.lastName || "");
        setPhone(authUser.phone || "");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [authUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const updated = await customerApi.updateMe({
        firstName,
        lastName,
        phone,
        address,
        city,
      });
      setProfile(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update profile details.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter orders matching customer
  const customerOrders = (allOrders || []).filter((o) => {
    if (!profile?.email && !authUser?.email) return true;
    const matchEmail = (profile?.email || authUser?.email || "").toLowerCase();
    return (
      o.customerEmail?.toLowerCase() === matchEmail ||
      o.customerName?.toLowerCase().includes((profile?.firstName || "").toLowerCase())
    );
  });

  const completedOrders = customerOrders.filter(
    (o) => o.status === "DELIVERED" || o.paymentStatus === "PAID"
  );
  const totalSpent = customerOrders.reduce(
    (acc, curr) => acc + (Number(curr.total) || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Customer Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-xl shadow-teal-500/15">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black shadow-inner border border-white/20">
              {profile?.firstName?.charAt(0) || "C"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome, {profile?.firstName || authUser?.firstName || "Customer"}!
                </h1>
                <Badge className="bg-white/20 text-white border-white/30 text-xs font-semibold px-2.5 py-0.5">
                  CUSTOMER ACCOUNT
                </Badge>
              </div>
              <p className="text-teal-100 text-sm mt-1">
                View your hardware purchase history, track active shipments, and manage shipping addresses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/shop">
              <Button
                variant="secondary"
                className="bg-white text-teal-800 hover:bg-teal-50 font-bold shadow-md hover:scale-105 transition-all text-xs sm:text-sm"
              >
                <Store className="w-4 h-4 mr-2" />
                Browse Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your customer profile and shipping address have been saved successfully to PostgreSQL!</span>
        </div>
      )}

      {/* 2. Customer Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Total Orders
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {customerOrders.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Delivered
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {completedOrders.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Total Purchases
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              ${totalSpent.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Active Role
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              CUSTOMER
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Profile & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer Profile & Address */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Customer Profile
                </h3>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl h-8 px-2.5 text-xs font-semibold border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0968999414"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                    Default Shipping Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Street, sangkat, apartment..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    placeholder="Phnom Penh"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {errorMessage && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMessage}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    size="sm"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <Save className="w-3.5 h-3.5 mr-1" />
                    )}
                    Save Profile
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-zinc-400 block">
                      Email Address
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white break-all">
                      {profile?.email || authUser?.email || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-zinc-400 block">
                      Phone Number
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {profile?.phone || "No phone number set"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-zinc-400 block">
                      Shipping Address
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {profile?.address || "No shipping address set yet"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-zinc-400 block">
                      City / Region
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {profile?.city || "Phnom Penh, Cambodia"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role & Permissions Info Box */}
          <div className="p-5 rounded-3xl bg-teal-50/60 dark:bg-zinc-800/60 border border-teal-200/80 dark:border-zinc-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-300">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Customer Access Level</span>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
              You are signed in with the <strong className="text-teal-700 dark:text-teal-300">CUSTOMER</strong> role.
              You have access to store purchases, checkout, order tracking, and profile management.
            </p>
            <p className="text-slate-500 dark:text-zinc-500 text-[11px]">
              Administrative tools (Point of Sale, Inventory Management, Financial Reports) are restricted to store managers.
            </p>
          </div>
        </div>

        {/* Right Column: Customer Orders List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  My Orders & Hardware Purchases
                </h3>
              </div>
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="rounded-xl h-8 px-2.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                  Full Orders View
                </Button>
              </Link>
            </div>

            {customerOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto text-2xl">
                  🛒
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  No orders found
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Explore our premium hardware catalog and place your first computer or gaming system order!
                </p>
                <Link href="/shop">
                  <Button className="mt-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm">
                    Browse Hardware Store
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {customerOrders.map((order) => {
                  const isPaid = order.paymentStatus === "PAID";
                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 hover:border-teal-400/50 dark:hover:border-teal-600/50 bg-slate-50/50 dark:bg-zinc-850/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 font-mono text-xs font-bold">
                          #{order.orderNumber ? order.orderNumber.slice(-4) : order.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {order.orderNumber || `ORD-${order.id}`}
                            </span>
                            <Badge
                              className={`text-[10px] font-semibold px-2 py-0.2 ${
                                isPaid
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {order.paymentStatus || order.status}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "Recent Order"}
                            </span>
                            <span>•</span>
                            <span>{order.items?.length || 1} item(s)</span>
                            <span>•</span>
                            <span>{order.paymentMethod || "BAKONG KHQR"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 dark:border-zinc-800">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Total
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            ${Number(order.total || 0).toFixed(2)}
                          </span>
                        </div>
                        <Link href="/orders">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl h-8 px-2.5 text-xs font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
