"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Megaphone,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Eye,
  ExternalLink,
  Sparkles,
  Sliders,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CmsBanner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkText: string;
  linkUrl: string;
  active: boolean;
}

export function DashboardContentTab() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Announcement Bar Ticker State
  const [announcementText, setAnnouncementText] = useState(
    "⚡ Free Express Delivery on all hardware orders over $1,000 | Official Warranty Included | Hotline: +855 23 888 999"
  );
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementBg, setAnnouncementBg] = useState("bg-slate-900");

  // Promotional Hero Banners State
  const [banners, setBanners] = useState<CmsBanner[]>([
    {
      id: "b1",
      badge: "HOT LAUNCH",
      title: "MacBook Pro 16\" M3 Max",
      subtitle: "Experience revolutionary computing speed with 40-core GPU and 128GB Unified Memory.",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
      linkText: "Shop Flagship",
      linkUrl: "/shop",
      active: true,
    },
    {
      id: "b2",
      badge: "SPECIAL PROMO",
      title: "NVIDIA GeForce RTX 4090 Series",
      subtitle: "Unmatched 4K gaming and generative AI powerhouse now back in stock with local warranty.",
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80",
      linkText: "Explore GPUs",
      linkUrl: "/shop",
      active: true,
    },
  ]);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CmsBanner | null>(null);
  const [bannerForm, setBannerForm] = useState<Omit<CmsBanner, "id">>({
    badge: "NEW",
    title: "",
    subtitle: "",
    imageUrl: "",
    linkText: "Shop Now",
    linkUrl: "/shop",
    active: true,
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedCms = localStorage.getItem("techshop_cms_content");
      if (savedCms) {
        const parsed = JSON.parse(savedCms);
        if (parsed.announcementText) setAnnouncementText(parsed.announcementText);
        if (typeof parsed.announcementActive === "boolean") setAnnouncementActive(parsed.announcementActive);
        if (parsed.announcementBg) setAnnouncementBg(parsed.announcementBg);
        if (Array.isArray(parsed.banners)) setBanners(parsed.banners);
      }
    } catch {}
  }, []);

  const handleSaveAll = () => {
    const data = {
      announcementText,
      announcementActive,
      announcementBg,
      banners,
    };
    localStorage.setItem("techshop_cms_content", JSON.stringify(data));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const openAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      badge: "NEW",
      title: "",
      subtitle: "",
      imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&q=80",
      linkText: "Shop Now",
      linkUrl: "/shop",
      active: true,
    });
    setIsBannerModalOpen(true);
  };

  const openEditBanner = (b: CmsBanner) => {
    setEditingBanner(b);
    setBannerForm({
      badge: b.badge,
      title: b.title,
      subtitle: b.subtitle,
      imageUrl: b.imageUrl,
      linkText: b.linkText,
      linkUrl: b.linkUrl,
      active: b.active,
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) return;

    if (editingBanner) {
      setBanners(
        banners.map((b) => (b.id === editingBanner.id ? { ...bannerForm, id: b.id } : b))
      );
    } else {
      setBanners([
        ...banners,
        {
          ...bannerForm,
          id: `b-${Date.now()}`,
        },
      ]);
    }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  const handleToggleBanner = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Content Management (CMS)
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              Live Storefront
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Customize promotional header announcements, storefront hero sliders, and campaign tickers.
          </p>
        </div>

        <Button
          onClick={handleSaveAll}
          className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-xs cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Published to Store!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* 1. Announcement Bar Ticker Settings */}
      <Card>
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-600" />
            <span>Top Announcement Header Bar</span>
          </CardTitle>
          <CardDescription>
            High-visibility ticker ribbon rendered across the storefront top navigation.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1.5">
              Announcement Ticker Text
            </label>
            <Input
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. ⚡ Free Express Delivery on all orders over $1,000"
              className="text-xs h-9"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-600 dark:text-zinc-400">
                Background Theme:
              </span>
              <div className="flex gap-1.5">
                {[
                  { label: "Dark Slate", cls: "bg-slate-900 text-white" },
                  { label: "Blue Brand", cls: "bg-blue-600 text-white" },
                  { label: "Emerald Sale", cls: "bg-emerald-600 text-white" },
                  { label: "Purple Hot", cls: "bg-purple-600 text-white" },
                ].map((th) => (
                  <button
                    key={th.cls}
                    type="button"
                    onClick={() => setAnnouncementBg(th.cls.split(" ")[0])}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                      announcementBg === th.cls.split(" ")[0]
                        ? "border-blue-600 ring-2 ring-blue-500/30 font-black"
                        : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="announcement-toggle"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="announcement-toggle"
                className="font-bold text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                Enable Top Announcement Bar
              </label>
            </div>
          </div>

          {/* Live Preview */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Live Preview
            </p>
            <div
              className={`py-1.5 px-3 rounded-lg text-center text-xs font-semibold text-white ${announcementBg} transition-colors`}
            >
              {announcementActive ? announcementText : "(Announcement Bar Disabled)"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Promotional Hero Banners */}
      <Card>
        <CardHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>Promotional Hero Banners ({banners.length})</span>
            </CardTitle>
            <CardDescription>
              Main storefront banners for new arrivals, seasonal deals, and GPU hardware.
            </CardDescription>
          </div>

          <Button
            onClick={openAddBanner}
            size="sm"
            className="h-8 px-3 text-xs font-bold gap-1 bg-purple-600 hover:bg-purple-500 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Banner</span>
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                    <span className="inline-block self-start px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white mb-1">
                      {b.badge}
                    </span>
                    <h3 className="font-extrabold text-sm text-white line-clamp-1">
                      {b.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                      {b.subtitle}
                    </p>
                  </div>

                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.active
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {b.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Footer Actions */}
                <div className="p-3 bg-slate-50/70 dark:bg-zinc-900/60 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleBanner(b.id)}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 font-medium"
                  >
                    {b.active ? "Pause Banner" : "Activate Banner"}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditBanner(b)}
                      className="h-7 px-2 text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBanner(b.id)}
                      className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Banner Dialog */}
      <Dialog open={isBannerModalOpen} onOpenChange={setIsBannerModalOpen}>
        <DialogHeader onClose={() => setIsBannerModalOpen(false)}>
          <DialogTitle>
            {editingBanner ? "Edit Promotional Banner" : "Create New Storefront Banner"}
          </DialogTitle>
          <DialogDescription>
            Configure the banner headline, image URL, and target button action.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveBanner} className="space-y-4 text-xs py-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Badge Tag (e.g. HOT, NEW, 20% OFF)
              </label>
              <Input
                required
                value={bannerForm.badge}
                onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Banner Headline Title *
              </label>
              <Input
                required
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="e.g. AMD Ryzen 9 7950X3D Desktop"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Subtitle Description
            </label>
            <Input
              value={bannerForm.subtitle}
              onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
              placeholder="e.g. Unleash ultimate gaming FPS with 144MB 3D V-Cache."
              className="h-9 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Banner Background Image URL *
            </label>
            <Input
              required
              value={bannerForm.imageUrl}
              onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Button Label
              </label>
              <Input
                value={bannerForm.linkText}
                onChange={(e) => setBannerForm({ ...bannerForm, linkText: e.target.value })}
                placeholder="Shop Now"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Target URL
              </label>
              <Input
                value={bannerForm.linkUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                placeholder="/shop"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="banner-active"
              checked={bannerForm.active}
              onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="banner-active" className="font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer">
              Active on Storefront
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsBannerModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 text-white font-bold">
              {editingBanner ? "Update Banner" : "Add Banner"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
