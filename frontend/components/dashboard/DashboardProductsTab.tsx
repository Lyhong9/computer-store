"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  ExternalLink,
  Upload,
  AlertCircle,
  RefreshCw,
  HardDrive,
  UploadCloud,
  Loader2,
} from "lucide-react";
import {
  useProducts,
  useCategories,
  useBrands,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useStoreData";
import { uploadsApi } from "@/services/api";
import { Product, Category, Brand } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardProductsTabProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function DashboardProductsTab({
  isModalOpen,
  setIsModalOpen,
}: DashboardProductsTabProps) {
  const { data: products = [], isLoading, refetch, isFetching } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN_STOCK" | "LOW_STOCK">("ALL");

  // Edit / Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    description: string;
    price: string;
    stock: string;
    categoryId: number;
    brandId: number;
    featured: boolean;
    images: string[];
    newImageUrl: string;
  }>({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "20",
    categoryId: 1,
    brandId: 1,
    featured: false,
    images: [],
    newImageUrl: "",
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `SKU-${Date.now().toString().slice(-5)}`,
      description: "",
      price: "",
      stock: "20",
      categoryId: categories[0]?.id || 1,
      brandId: brands[0]?.id || 1,
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
      ],
      newImageUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const existingImages =
      p.images && p.images.length > 0
        ? p.images
        : p.primaryImage
        ? [p.primaryImage]
        : [];

    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description || "",
      price: p.price.toString(),
      stock: p.quantityOnHand.toString(),
      categoryId: p.categoryId || categories[0]?.id || 1,
      brandId: p.brandId || brands[0]?.id || 1,
      featured: p.featured || false,
      images: existingImages,
      newImageUrl: "",
    });
    setIsModalOpen(true);
  };

  const productFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingProductImg, setIsUploadingProductImg] = useState(false);
  const [productUploadError, setProductUploadError] = useState<string | null>(null);

  const handleUploadProductImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingProductImg(true);
    setProductUploadError(null);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadsApi.uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err: any) {
      setProductUploadError(err?.message || "Failed to upload image(s) from drive.");
    } finally {
      setIsUploadingProductImg(false);
    }
  };

  const handleAddImage = () => {
    if (formData.newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.newImageUrl.trim()],
        newImageUrl: "",
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev) => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: [selected, ...rest] };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;

    if (editingProduct) {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: {
          name: formData.name,
          sku: formData.sku,
          description: formData.description,
          price: priceNum,
          quantityOnHand: stockNum,
          categoryId: formData.categoryId,
          brandId: formData.brandId,
          featured: formData.featured,
          images: formData.images,
        },
      });
    } else {
      await createProductMutation.mutateAsync({
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: priceNum,
        quantityOnHand: stockNum,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        featured: formData.featured,
        images: formData.images,
      });
    }

    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteCandidate) {
      await deleteProductMutation.mutateAsync(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brandName && p.brandName.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" ||
      (p.categoryId && p.categoryId.toString() === selectedCategory) ||
      (p.categoryName && p.categoryName.toLowerCase() === selectedCategory.toLowerCase());

    const matchesBrand =
      selectedBrand === "ALL" ||
      (p.brandId && p.brandId.toString() === selectedBrand) ||
      (p.brandName && p.brandName.toLowerCase() === selectedBrand.toLowerCase());

    const matchesStock =
      stockFilter === "ALL" ||
      (stockFilter === "LOW_STOCK" && p.quantityOnHand <= 10) ||
      (stockFilter === "IN_STOCK" && p.quantityOnHand > 10);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Products Catalog
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {products.length} Products
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Manage hardware products, inventory stock, and multiple image galleries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-9 gap-1.5 text-slate-700 dark:text-zinc-300"
            title="Refresh catalog from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync</span>
          </Button>

          <Button
            onClick={openAddModal}
            size="sm"
            className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search by product name, SKU, or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-slate-400" />}
              className="h-9 text-xs"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-xs focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-xs focus:outline-none"
            >
              <option value="ALL">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-xs focus:outline-none"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt;10)</option>
              <option value="LOW_STOCK">Low Stock (≤10)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table Card */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-200">
              No products found
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                <TableHead className="w-[300px]">Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Gallery</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => {
                const imgList =
                  p.images && p.images.length > 0
                    ? p.images
                    : p.primaryImage
                    ? [p.primaryImage]
                    : ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"];

                return (
                  <TableRow
                    key={p.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Product Cell */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={imgList[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 dark:text-zinc-100 block text-xs truncate max-w-[220px]">
                            {p.name}
                          </span>
                          {p.featured && (
                            <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* SKU */}
                    <TableCell className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                      {p.sku}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                      {p.categoryName || "Hardware"}
                    </TableCell>

                    {/* Brand */}
                    <TableCell className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                      {p.brandName || "Premium"}
                    </TableCell>

                    {/* Images Gallery Thumbnails */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {imgList.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`gallery ${idx + 1}`}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-zinc-700 hover:scale-125 transition-transform shadow-xs"
                          />
                        ))}
                        {imgList.length > 3 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                            +{imgList.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-extrabold text-sm text-slate-900 dark:text-zinc-50">
                      {formatCurrency(p.price)}
                    </TableCell>

                    {/* Stock status badge */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.quantityOnHand <= 10
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
                        }`}
                      >
                        {p.quantityOnHand} in stock
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditModal(p)}
                        className="h-8 text-xs font-semibold px-3"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteCandidate(p)}
                        className="h-8 text-xs font-semibold px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add / Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader onClose={() => setIsModalOpen(false)}>
          <DialogTitle>
            {editingProduct ? "Edit Product Details" : "Add New Hardware Product"}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? `Updating SKU: ${editingProduct.sku}`
              : "Enter product hardware specifications, pricing, inventory, and image URLs."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Product Name *
              </label>
              <Input
                required
                placeholder="e.g. ASUS ROG Zephyrus G16"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                SKU Identifier *
              </label>
              <Input
                required
                placeholder="e.g. ASUS-G16-4080"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: Number(e.target.value) })
                }
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-slate-900 dark:text-zinc-100"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Brand
              </label>
              <select
                value={formData.brandId}
                onChange={(e) =>
                  setFormData({ ...formData, brandId: Number(e.target.value) })
                }
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-slate-900 dark:text-zinc-100"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Price (USD) *
              </label>
              <Input
                required
                type="number"
                step="0.01"
                placeholder="e.g. 1999.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Stock Quantity *
              </label>
              <Input
                required
                type="number"
                placeholder="e.g. 25"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed specifications, performance metrics, and hardware features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Multiple Image Gallery Manager */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Image Gallery ({formData.images.length})
              </label>
              <span className="text-[11px] text-slate-400">First image is primary cover</span>
            </div>

            {/* Hidden file input for drive images */}
            <input
              ref={productFileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={(e) => {
                handleUploadProductImages(e.target.files);
                e.target.value = "";
              }}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                onClick={() => productFileInputRef.current?.click()}
                disabled={isUploadingProductImg}
                size="sm"
                className="h-9 px-4 text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex-shrink-0"
              >
                {isUploadingProductImg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4" />
                    <span>Upload from Drive</span>
                  </>
                )}
              </Button>

              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Or paste image URL (https://...)"
                  value={formData.newImageUrl}
                  onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                  className="text-xs h-9"
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  size="sm"
                  variant="outline"
                  className="h-9 px-3 text-xs flex-shrink-0"
                >
                  Add URL
                </Button>
              </div>
            </div>

            {productUploadError && (
              <p className="text-xs text-rose-500 font-medium">{productUploadError}</p>
            )}

            {/* Thumbnail previews */}
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-zinc-700"
                >
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[9px] font-bold text-center py-0.5">
                      PRIMARY
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        title="Set as Primary"
                        className="p-1 rounded bg-white text-slate-900 hover:bg-blue-50"
                      >
                        <Check className="w-3 h-3 text-blue-600" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove"
                      className="p-1 rounded bg-rose-600 text-white hover:bg-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-zinc-700"
            />
            <label
              htmlFor="featured-check"
              className="text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer"
            >
              Highlight as Featured Hardware on Storefront
            </label>
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
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              {editingProduct ? "Save Changes" : "Create Product"}
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
            Confirm Product Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-bold text-slate-900 dark:text-zinc-100">
              "{deleteCandidate?.name}"
            </span>
            ? This action cannot be undone.
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
            disabled={deleteProductMutation.isPending}
          >
            Delete Product
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
