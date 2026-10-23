"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRightLeft,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { usersApi, UserAccount } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const SAMPLE_FALLBACK_USERS: UserAccount[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    firstName: "System",
    lastName: "Admin",
    role: "ADMIN",
    roles: ["ADMIN"],
    enabled: true,
  },
  {
    id: 2,
    username: "damlyhong39",
    email: "damlyhong39@gmail.com",
    firstName: "Index X",
    lastName: "Hong",
    role: "ADMIN",
    roles: ["ADMIN"],
    enabled: true,
  },
  {
    id: 3,
    username: "activatorcode9999",
    email: "activatorcode9999@gmail.com",
    firstName: "Acti",
    lastName: "Vator",
    role: "ADMIN",
    roles: ["ADMIN"],
    enabled: true,
  },
  {
    id: 4,
    username: "damlyhong9999",
    email: "damlyhong9999@gmail.com",
    firstName: "Ly",
    lastName: "Hong",
    role: "CUSTOMER",
    roles: ["CUSTOMER"],
    enabled: true,
  },
];

export function DashboardCustomersTab() {
  const { user: currentAuthUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>(SAMPLE_FALLBACK_USERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "CUSTOMER">("ALL");
  const [statusNotification, setStatusNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load live users from Spring Boot backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      }
    } catch (err) {
      console.warn("Could not load users from backend, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update Role handler (ADMIN <-> CUSTOMER)
  const handleUpdateRole = async (
    userId: number,
    newRole: "ADMIN" | "CUSTOMER",
    email?: string
  ) => {
    setUpdatingId(userId);
    setStatusNotification(null);

    // Optimistic UI update
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: newRole, roles: [newRole] }
          : u
      )
    );

    try {
      const updated = await usersApi.updateRole(userId, newRole, email);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated, role: newRole } : u))
      );
      setStatusNotification({
        type: "success",
        message: `Successfully updated user #${userId} (${email || "account"}) to role: ${newRole}`,
      });
      setTimeout(() => setStatusNotification(null), 4000);

      // If updating current user's role, refresh the live auth session immediately
      if (
        currentAuthUser &&
        (currentAuthUser.id === userId ||
          currentAuthUser.email === email ||
          currentAuthUser.username === email)
      ) {
        await refreshUser();
      }
    } catch (err: any) {
      // Revert optimistic update on failure
      setUsers(previousUsers);
      setStatusNotification({
        type: "error",
        message: `Failed to update role: ${err?.message || "Server error"}`,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered list
  const filtered = users.filter((u) => {
    const query = search.toLowerCase();
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const matchesSearch =
      u.username?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      fullName.includes(query);

    if (!matchesSearch) return false;
    if (roleFilter === "ALL") return true;
    return u.role === roleFilter;
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Users &amp; Roles Management
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {users.length} Accounts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Assign and update user privileges between <strong>ADMIN</strong> and <strong>CUSTOMER</strong>. Synchronized live with Spring Boot &amp; Clerk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="text-xs font-bold gap-1.5 h-9 bg-white dark:bg-zinc-900 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Accounts</span>
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusNotification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in ${
            statusNotification.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
              Total Registered
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {users.length} Users
            </span>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500/80 dark:text-purple-400/80 block">
              Admin Role
            </span>
            <span className="text-xl font-black text-purple-900 dark:text-purple-300">
              {adminCount} Administrators
            </span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80 block">
              Customer Role
            </span>
            <span className="text-xl font-black text-emerald-900 dark:text-emerald-300">
              {customerCount} Regular Buyers
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search by name, username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
            className="h-9 text-xs"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setRoleFilter("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              roleFilter === "ALL"
                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:text-zinc-400"
            }`}
          >
            All ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("ADMIN")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              roleFilter === "ADMIN"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admins ({adminCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("CUSTOMER")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              roleFilter === "CUSTOMER"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Customers ({customerCount})</span>
          </button>
        </div>
      </Card>

      {/* 4. Users Data Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
              <TableHead className="w-[280px]">User Account</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead className="text-right">Action: Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400 text-xs">
                  No accounts matched your search or filter.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => {
                const isAdmin = u.role === "ADMIN";
                const isUpdating = updatingId === u.id;
                const displayName =
                  `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                  u.username ||
                  "User Account";

                const initials = (u.username || u.email || "US")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <TableRow
                    key={u.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* User Identity Column */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0 ${
                            isAdmin
                              ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
                              : "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white"
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 block truncate">
                            {displayName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono truncate block">
                            @{u.username} (ID: #{u.id})
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Email Column */}
                    <TableCell className="text-xs text-slate-600 dark:text-zinc-300 font-mono">
                      <a
                        href={`mailto:${u.email}`}
                        className="hover:underline hover:text-blue-600 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{u.email}</span>
                      </a>
                    </TableCell>

                    {/* Current Role Badge */}
                    <TableCell>
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300/80 dark:border-purple-800 shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>ADMIN</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-xs">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>CUSTOMER</span>
                        </span>
                      )}
                    </TableCell>

                    {/* Status Indicator */}
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active</span>
                      </span>
                    </TableCell>

                    {/* Interactive Role Switch Action */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateRole(u.id, "CUSTOMER", u.email)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:border-slate-400 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                            title="Downgrade privileges to Customer"
                          >
                            {isUpdating ? (
                              <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>Demote to Customer</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateRole(u.id, "ADMIN", u.email)}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs shadow-purple-600/20 disabled:opacity-50"
                            title="Promote privileges to Admin"
                          >
                            {isUpdating ? (
                              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-200" />
                            )}
                            <span>Promote to Admin</span>
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
