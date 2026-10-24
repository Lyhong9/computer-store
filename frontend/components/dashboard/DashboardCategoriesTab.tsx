"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, FolderTree, AlertCircle, RefreshCw } from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useStoreData";
import { Category } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function DashboardCategoriesTab() {
  const { data: categories = [], isLoading, refetch, isFetching } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "💻",
    banner: "",
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      description: "",
      icon: "💻",
      banner: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setForm({
      name: c.name,
      description: c.description || "",
      icon: c.icon || "💻",
      banner: c.banner || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingCategory) {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        data: form,
      });
    } else {
      await createCategoryMutation.mutateAsync(form);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteCandidate) {
      await deleteCategoryMutation.mutateAsync(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Categories
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {categories.length} Categories
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Organize hardware catalog by taxonomy, department banners and icons.
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
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Card key={c.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Banner preview */}
            <div className="h-32 w-full bg-slate-100 dark:bg-zinc-800 relative overflow-hidden">
              {c.banner ? (
                <img
                  src={c.banner}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="text-2xl drop-shadow">{c.icon || "💻"}</span>
                <span className="font-bold text-lg text-white drop-shadow">
                  {c.name}
                </span>
              </div>
            </div>

            <CardContent className="p-5 space-y-3">
              <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 min-h-[32px]">
                {c.description || "Hardware category catalog and specifications."}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                  ID: #{c.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(c)}
                    className="h-8 text-xs font-semibold px-2.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteCandidate(c)}
                    className="h-8 text-xs font-semibold px-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Category Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader onClose={() => setIsModalOpen(false)}>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add Hardware Category"}
          </DialogTitle>
          <DialogDescription>
            Configure name, icon, banner image and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Category Name *
              </label>
              <Input
                required
                placeholder="e.g. Laptops"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Icon Emoji
              </label>
              <Input
                placeholder="💻"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>
          </div>

          <ImageUpload
            label="Upload Banner Image from Drive"
            value={form.banner}
            onChange={(url) => setForm({ ...form, banner: url })}
            aspectRatio="banner"
            placeholder="Select a banner image from your drive (PNG, JPG, WEBP)"
          />

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Overview of this hardware department..."
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
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              {editingCategory ? "Save Changes" : "Create Category"}
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
            Confirm Category Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-bold text-slate-900 dark:text-zinc-100">
              "{deleteCandidate?.name}"
            </span>
            ? Products in this category will become unassigned.
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
            disabled={deleteCategoryMutation.isPending}
          >
            Delete Category
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
