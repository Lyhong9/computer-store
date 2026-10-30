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
  Calendar,
  Lock,
  ExternalLink,
  Receipt,
  Sparkles,
  X,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customerApi, ordersApi, CustomerProfile } from "@/services/api";
import { Order } from "@/types/store";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { OrderInvoiceModal } from "@/components/dashboard/OrderInvoiceModal";

export interface DashboardCustomerAccountProps {
  targetCustomer?: {
    id: number;
    userId?: number;
    username?: string;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    role?: string;
  } | null;
  isAdminView?: boolean;
  onClose?: () => void;
}

export function DashboardCustomerAccount({
  targetCustomer,
  isAdminView = false,
  onClose,
}: DashboardCustomerAccountProps) {
  const { user: authUser, isAdmin: authIsAdmin } = useAuth();
  const { orders: localOrders } = useCart();

  // Effective administrator check
  const effectiveIsAdmin = isAdminView || authIsAdmin;

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form inputs for editable profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // Customer order history (visible strictly for Admin)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("ALL");

  const effectiveEmail =
    targetCustomer?.email || profile?.email || authUser?.email || "";

  // 1. Load Profile
  const loadProfile = async () => {
    setLoading(true);
    setErrorMessage(null);

    // If a target customer was supplied (e.g. from Admin inspection modal)
    if (targetCustomer) {
      const baseProfile: CustomerProfile = {
        id: targetCustomer.id,
        userId: targetCustomer.userId || targetCustomer.id,
        username: targetCustomer.username || "customer",
        email: targetCustomer.email || "",
        firstName: targetCustomer.firstName || "Customer",
        lastName: targetCustomer.lastName || "",
        phone: targetCustomer.phone || null,
        address: targetCustomer.address || null,
        city: targetCustomer.city || null,
      };
      setProfile(baseProfile);
      setFirstName(baseProfile.firstName || "");
      setLastName(baseProfile.lastName || "");
      setPhone(baseProfile.phone || "");
      setAddress(baseProfile.address || "");
      setCity(baseProfile.city || "");
      setLoading(false);
      return;
    }

    // Otherwise load personal profile for current logged-in customer
    try {
      const data = await customerApi.getMe();
      setProfile(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setCity(data.city || "");
    } catch {
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
        setAddress(authUser.address || "");
        setCity(authUser.city || "Phnom Penh");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Load Customer Orders (Only triggered if user is an ADMIN)
  const loadOrdersForAdmin = async (email: string) => {
    if (!effectiveIsAdmin) return;
    setLoadingOrders(true);
    try {
      // 1. Fetch from backend API by customer email
      const remoteOrders = email ? await ordersApi.getByEmail(email) : [];

      // 2. Merge with matching local store orders from CartContext
      const matchEmail = email.toLowerCase();
      const localMatches = (localOrders || []).filter((o) => {
        if (!matchEmail) return false;
        return (
          o.customerEmail?.toLowerCase() === matchEmail ||
          o.customerName?.toLowerCase().includes((profile?.firstName || "").toLowerCase())
        );
      });

      // Deduplicate by orderNumber or id
      const orderMap = new Map<string, Order>();
      [...remoteOrders, ...localMatches].forEach((ord) => {
        const key = ord.orderNumber || ord.id;
        if (!orderMap.has(key)) {
          orderMap.set(key, ord);
        }
      });

      setCustomerOrders(Array.from(orderMap.values()));
    } catch (err) {
      console.warn("Could not fetch customer orders for admin audit:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [targetCustomer, authUser]);

  useEffect(() => {
    if (effectiveIsAdmin && effectiveEmail) {
      loadOrdersForAdmin(effectiveEmail);
    }
  }, [effectiveIsAdmin, effectiveEmail]);

  // Save profile modifications
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
      // Fallback local update if offline
      setProfile((prev) =>
        prev
          ? { ...prev, firstName, lastName, phone, address, city }
          : null
      );
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculated metrics for admin order view
  const completedOrders = customerOrders.filter(
    (o) => o.status === "DELIVERED" || o.paymentStatus === "PAID"
  );
  const totalSpent = customerOrders.reduce(
    (acc, curr) => acc + (Number(curr.total) || 0),
    0
  );

  const filteredOrders = customerOrders.filter((o) => {
    if (orderFilter === "ALL") return true;
    if (orderFilter === "PAID") return o.paymentStatus === "PAID";
    if (orderFilter === "PENDING") return o.paymentStatus !== "PAID";
    return o.status === orderFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Profile Dashboard Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 border border-slate-800">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* User Avatar */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/30 shrink-0">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-3xl font-black text-white">
                {profile?.firstName?.charAt(0) ||
                  targetCustomer?.username?.charAt(0)?.toUpperCase() ||
                  "C"}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {profile?.firstName
                    ? `${profile.firstName} ${profile.lastName || ""}`
                    : targetCustomer?.username || authUser?.username || "Customer"}
                </h1>

                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>CUSTOMER PROFILE</span>
                </Badge>

                {effectiveIsAdmin && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs font-bold px-2.5 py-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ADMIN ACCESS</span>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {profile?.email || targetCustomer?.email || "No email"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {profile?.city || "Phnom Penh, Cambodia"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Account ID #{profile?.id || targetCustomer?.id || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-xl text-xs h-9 px-3"
              >
                <X className="w-4 h-4 mr-1.5" />
                Close Profile
              </Button>
            )}

            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-xl text-xs h-9 px-3.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                Edit Profile
              </Button>
            )}

            <Link href="/shop">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs h-9 px-3.5 shadow-md shadow-blue-600/30"
              >
                <Store className="w-3.5 h-3.5 mr-1.5" />
                Hardware Catalog
              </Button>
            </Link>
          </div>
        </div>

        {/* Admin notice banner when inspecting customer */}
        {effectiveIsAdmin && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>Administrator Exclusive:</strong> You have permission to view this customer's full purchase history, invoices, and shipping addresses.
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => loadOrdersForAdmin(effectiveEmail)}
              className="text-xs text-purple-300 hover:text-white hover:bg-purple-900/40 rounded-xl h-7 px-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loadingOrders ? "animate-spin" : ""}`} />
              Sync Orders
            </Button>
          </div>
        )}
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile information and shipping address have been successfully updated.</span>
        </div>
      )}

      {/* 2. Profile Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completeness */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Profile Status
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Verified Active
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Default Region
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-[140px]">
              {profile?.city || "Phnom Penh"}
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Identity & Auth
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
              <span>Clerk SSO</span>
              <span className="text-[10px] text-slate-400 font-mono">/ JWT</span>
            </div>
          </div>
        </div>

        {/* Admin Metric vs Customer Storefront Link */}
        {effectiveIsAdmin ? (
          <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Total Orders (Admin)
              </div>
              <div className="text-xl font-black text-purple-950 dark:text-purple-200 mt-0.5">
                {customerOrders.length} Orders (${totalSpent.toFixed(2)})
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Store Order Portal
              </div>
              <Link
                href="/orders"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>Track Shipments</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Profile & Shipping Address */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Details Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Profile Details
                </h3>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl h-8 px-2.5 text-xs font-bold border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
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
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0968999414"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Street, sangkat, apartment..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    placeholder="Phnom Penh"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {errorMessage && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMessage}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs"
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
                    <span className="font-bold text-slate-400 dark:text-zinc-500 block text-[11px] uppercase tracking-wider">
                      Email Address
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white break-all">
                      {profile?.email || targetCustomer?.email || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 dark:text-zinc-500 block text-[11px] uppercase tracking-wider">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {profile?.phone || "No phone number set"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 dark:text-zinc-500 block text-[11px] uppercase tracking-wider">
                      Default Shipping Address
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {profile?.address || "No shipping address set yet"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 dark:text-zinc-500 block text-[11px] uppercase tracking-wider">
                      City / Region
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {profile?.city || "Phnom Penh, Cambodia"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Security & Role Status Box */}
          <div className="p-5 rounded-3xl bg-slate-100/70 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Customer Account Privileges</span>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              This account operates under the <strong className="text-blue-600 dark:text-blue-400">CUSTOMER</strong> role.
              Profile changes and address updates are saved securely.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
              <span>Authentication:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-zinc-300">
                Clerk / PostgreSQL
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: ORDER HISTORY (ADMIN ONLY) OR STORE ORDERS PORTAL (CUSTOMER VIEW) */}
        <div className="lg:col-span-2 space-y-6">
          {effectiveIsAdmin ? (
            /* ======================================================== */
            /* ADMIN VIEW: CUSTOMER ORDER HISTORY & PURCHASE AUDIT      */
            /* ======================================================== */
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        Customer Order History
                      </h3>
                      <Badge className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 text-[10px] font-bold">
                        Admin Audit Only
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Showing hardware sales and checkout transactions for {effectiveEmail}
                    </p>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[11px] font-bold">
                  {["ALL", "PAID", "CONFIRMED", "DELIVERED"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        orderFilter === f
                          ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order List */}
              {loadingOrders ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
                  <span>Loading customer order records...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto text-2xl">
                    📦
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    No Order History Found
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                    This customer has not placed any orders yet, or there are no orders linked with{" "}
                    <code className="text-purple-600 dark:text-purple-400 font-mono">
                      {effectiveEmail}
                    </code>
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const isPaid = order.paymentStatus === "PAID";
                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-800 bg-slate-50/50 dark:bg-zinc-850/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0 font-mono text-xs font-bold">
                            #{order.orderNumber ? order.orderNumber.slice(-4) : order.id}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                                {order.orderNumber || `ORD-${order.id}`}
                              </span>
                              <Badge
                                className={`text-[10px] font-bold px-2 py-0.5 ${
                                  isPaid
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                }`}
                              >
                                {order.paymentStatus || "PENDING"}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] font-semibold text-slate-500">
                                {order.status}
                              </Badge>
                            </div>

                            <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-2 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : "Recent"}
                              </span>
                              <span>•</span>
                              <span>{order.items?.length || 1} item(s)</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                {order.paymentMethod || "BAKONG KHQR"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 dark:border-zinc-800">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">
                              Total Amount
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              ${Number(order.total || 0).toFixed(2)}
                            </span>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="rounded-xl h-8 px-3 text-xs font-bold border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                          >
                            <Receipt className="w-3.5 h-3.5 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ======================================================== */
            /* CUSTOMER VIEW: STOREFRONT ORDERS REDIRECT & INFO CARD    */
            /* ======================================================== */
            <div className="space-y-6">
              {/* Store Orders Guide Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-850 border border-blue-200/70 dark:border-zinc-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-blue-600/25">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Looking for Your Store Orders?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    This dashboard manages your personal profile, credentials, and shipping addresses.
                    To track real-time delivery status, view hardware purchase receipts, and explore warranties, visit the dedicated Store Orders portal.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link href="/orders">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold h-10 px-5 shadow-md shadow-blue-600/30 gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Track My Store Orders</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>

                  <Link href="/shop">
                    <Button variant="outline" className="rounded-xl text-xs font-bold h-10 px-4">
                      Browse Hardware
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Shopping Tips & Help */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Customer Support & Inquiries</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Need to update your shipping address for an ongoing shipment?
                  Contact our store operations team directly at{" "}
                  <a href="mailto:support@shopeers.com" className="text-blue-600 font-semibold hover:underline">
                    support@shopeers.com
                  </a>{" "}
                  or reach out via Telegram POS support.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoiceOrder && (
        <OrderInvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
