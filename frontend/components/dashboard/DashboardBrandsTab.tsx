"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Tag, ExternalLink, RefreshCw } from "lucide-react";
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from "@/hooks/useStoreData";
import { Brand } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function DashboardBrandsTab() {
  const { data: brands = [], isLoading, refetch, isFetching } = useBrands();
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Brand | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    banner: "",
    website: "",
  });

  const openAddModal = () => {
    setEditingBrand(null);
    setForm({
      name: "",
      description: "",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80",
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
      website: "https://example.com",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setForm({
      name: b.name,
      description: b.description || "",
      logo: b.logo || "",
      banner: b.banner || "",
      website: b.website || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingBrand) {
      await updateBrandMutation.mutateAsync({
        id: editingBrand.id,
        data: form,
      });
    } else {
      await createBrandMutation.mutateAsync(form);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteCandidate) {
      await deleteBrandMutation.mutateAsync(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Partner Brands
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {brands.length} Brands
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Manage authorized hardware manufacturers, logos, and partner portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>
          <Button
            onClick={openAddModal}
            size="sm"
            className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </Button>
        </div>
      </div>

      {/* Grid of Brands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((b) => (
          <Card key={b.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-2 flex items-center justify-center overflow-hidden shrink-0">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="font-black text-sm text-blue-600">
                      {b.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                {b.website && (
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-zinc-50">
                  {b.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 min-h-[32px]">
                  {b.description || "Authorized manufacturer and system components partner."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                  ID: #{b.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(b)}
                    className="h-8 text-xs font-semibold px-2.5 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteCandidate(b)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Brand Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader onClose={() => setIsModalOpen(false)}>
          <DialogTitle>{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
          <DialogDescription>
            Configure brand name, logo, official website and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Brand Name *
            </label>
            <Input
              required
              placeholder="e.g. ASUS ROG"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <ImageUpload
            label="Upload Brand Logo from Drive"
            value={form.logo}
            onChange={(url) => setForm({ ...form, logo: url })}
            aspectRatio="square"
            placeholder="Select a logo image from your drive (PNG, SVG, JPG)"
          />

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Official Website
            </label>
            <Input
              placeholder="https://rog.asus.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Hardware focus, warranty agreements and company info..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              {editingBrand ? "Save Changes" : "Create Brand"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteCandidate}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <DialogHeader onClose={() => setDeleteCandidate(null)}>
          <DialogTitle className="text-rose-600 dark:text-rose-400">
            Confirm Brand Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-bold text-slate-900 dark:text-zinc-100">
              "{deleteCandidate?.name}"
            </span>
            ? Products under this manufacturer will have their brand unassigned.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteCandidate(null)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={deleteBrandMutation.isPending}
          >
            Delete Brand
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
