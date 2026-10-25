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
  Barcode as BarcodeIcon,
  Download,
  PackagePlus,
  CheckSquare,
  Square,
  Layers,
  ArrowUpRight,
  FileSpreadsheet,
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
import {
  formatCurrency,
  normalizeImageUrl,
  handleImageError,
  DEFAULT_PRODUCT_PLACEHOLDER,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ModernSelect } from "@/components/ui/select";
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
import { ProductBarcodeModal } from "@/components/dashboard/ProductBarcodeModal";

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

  // Selection & Bulk Actions
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());

  // Edit / Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [barcodeProduct, setBarcodeProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importParsedList, setImportParsedList] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

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
    const existingImages = (
      p.images && p.images.length > 0
        ? p.images
        : p.primaryImage
        ? [p.primaryImage]
        : []
    ).map(normalizeImageUrl);

    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description || "",
      price: p.price.toString(),
      stock: p.quantityOnHand.toString(),
      categoryId:
        p.categoryId ||
        categories.find(
          (c) => c.name.toLowerCase() === (p.categoryName || "").toLowerCase()
        )?.id ||
        1,
      brandId:
        p.brandId ||
        brands.find(
          (b) => b.name.toLowerCase() === (p.brandName || "").toLowerCase()
        )?.id ||
        1,
      featured: p.featured || false,
      images:
        existingImages.length > 0
          ? existingImages
          : [DEFAULT_PRODUCT_PLACEHOLDER],
      newImageUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const url = await uploadsApi.uploadFile(file);
      if (url) {
        setFormData((prev) => ({
          ...prev,
          images: [url, ...prev.images],
        }));
      }
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      setUploadError(err.message || "Failed to upload image. Please try another file.");
    } finally {
      setUploadingImage(false);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
    }
  };

  const handleAddImageUrl = () => {
    if (formData.newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, formData.newImageUrl.trim()],
        newImageUrl: "",
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
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

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedProductIds.size === filteredProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleToggleSelect = (id: number) => {
    const updated = new Set(selectedProductIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedProductIds(updated);
  };

  const handleBulkRestock = async (amount: number) => {
    for (const id of Array.from(selectedProductIds)) {
      const p = products.find((item) => item.id === id);
      if (p) {
        await updateProductMutation.mutateAsync({
          id,
          data: { quantityOnHand: (p.quantityOnHand || 0) + amount },
        });
      }
    }
    setSelectedProductIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProductIds.size} selected products?`)) return;
    for (const id of Array.from(selectedProductIds)) {
      await deleteProductMutation.mutateAsync(id);
    }
    setSelectedProductIds(new Set());
  };

  // Quick Restock Single Product
  const submitSingleRestock = async () => {
    if (!restockProduct) return;
    await updateProductMutation.mutateAsync({
      id: restockProduct.id,
      data: { quantityOnHand: (restockProduct.quantityOnHand || 0) + restockAmount },
    });
    setRestockProduct(null);
  };

  // CSV Export
  const exportProductsCsv = () => {
    if (products.length === 0) return;

    const headers = [
      "ID",
      "SKU",
      "Name",
      "Category",
      "Brand",
      "Price",
      "Original Price",
      "Stock",
      "Featured",
      "Badge",
      "Primary Image",
    ];

    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.categoryName || "Hardware"}"`,
      `"${p.brandName || "TechShop"}"`,
      p.price,
      p.originalPrice || "",
      p.quantityOnHand,
      p.featured ? "TRUE" : "FALSE",
      `"${p.badge || ""}"`,
      `"${p.primaryImage || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `techshop_products_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length < 2) return;

      const parsed: any[] = [];
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.replace(/^"|"$/g, "").trim());
        if (parts.length >= 4) {
          parsed.push({
            name: parts[2] || parts[0],
            sku: parts[1] || `SKU-IMP-${Date.now()}-${i}`,
            categoryName: parts[3] || "Hardware",
            brandName: parts[4] || "TechShop",
            price: parseFloat(parts[5]) || 99.99,
            quantityOnHand: parseInt(parts[7], 10) || 20,
            description: "Bulk imported component.",
          });
        }
      }
      setImportParsedList(parsed);
    };
    reader.readAsText(file);
  };

  const executeBulkImport = async () => {
    if (importParsedList.length === 0) return;
    setIsImporting(true);

    try {
      for (const item of importParsedList) {
        await createProductMutation.mutateAsync({
          name: item.name,
          sku: item.sku,
          description: item.description,
          price: item.price,
          quantityOnHand: item.quantityOnHand,
          categoryId: categories[0]?.id || 1,
          brandId: brands[0]?.id || 1,
          images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
          ],
        });
      }
      setIsImportModalOpen(false);
      setImportParsedList([]);
      refetch();
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 relative pb-16">
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
            Manage hardware products, print warehouse barcode labels, and batch import/export CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Import */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="text-xs h-9 gap-1.5 text-slate-700 dark:text-zinc-300"
            title="Import products from CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import CSV</span>
          </Button>

          {/* CSV Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportProductsCsv}
            className="text-xs h-9 gap-1.5 text-slate-700 dark:text-zinc-300"
            title="Export products to CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </Button>

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
            <ModernSelect
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(String(val))}
              size="md"
              options={[
                { value: "ALL", label: "All Categories" },
                ...categories.map((c) => ({ value: c.name, label: c.name })),
              ]}
            />

            {/* Brand Filter */}
            <ModernSelect
              value={selectedBrand}
              onChange={(val) => setSelectedBrand(String(val))}
              size="md"
              options={[
                { value: "ALL", label: "All Brands" },
                ...brands.map((b) => ({ value: b.name, label: b.name })),
              ]}
            />

            {/* Stock Filter */}
            <ModernSelect
              value={stockFilter}
              onChange={(val) => setStockFilter(val as any)}
              size="md"
              options={[
                { value: "ALL", label: "All Stock Levels" },
                {
                  value: "IN_STOCK",
                  label: "In Stock (>10)",
                  icon: <span className="w-2 h-2 rounded-full bg-emerald-500" />,
                },
                {
                  value: "LOW_STOCK",
                  label: "Low Stock (≤10)",
                  icon: <span className="w-2 h-2 rounded-full bg-rose-500" />,
                },
              ]}
            />
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
                <TableHead className="w-10">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                    title={selectedProductIds.size === filteredProducts.length ? "Deselect All" : "Select All"}
                  >
                    {selectedProductIds.size > 0 && selectedProductIds.size === filteredProducts.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="w-[280px]">Product</TableHead>
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
                    ? p.images.map(normalizeImageUrl)
                    : p.primaryImage
                    ? [normalizeImageUrl(p.primaryImage)]
                    : [DEFAULT_PRODUCT_PLACEHOLDER];

                const isSelected = selectedProductIds.has(p.id);

                return (
                  <TableRow
                    key={p.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-blue-50/40 dark:bg-blue-950/20"
                        : "hover:bg-slate-50/80 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="w-10 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>

                    {/* Product Cell */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={normalizeImageUrl(imgList[0])}
                          alt={p.name}
                          onError={(e) => handleImageError(e)}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 dark:text-zinc-100 block text-xs truncate max-w-[200px]">
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
                            src={normalizeImageUrl(img)}
                            alt={`${p.name} gallery ${idx + 1}`}
                            onError={(e) => handleImageError(e)}
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
                    <TableCell className="text-right space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRestockProduct(p);
                          setRestockAmount(10);
                        }}
                        title="Quick Restock Inventory"
                        className="h-8 text-xs font-semibold px-2.5 text-slate-700 dark:text-zinc-300"
                      >
                        <PackagePlus className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span className="hidden xl:inline">Restock</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBarcodeProduct(p)}
                        title="Print SKU Barcode Label"
                        className="h-8 text-xs font-semibold px-2.5 text-slate-700 dark:text-zinc-300"
                      >
                        <BarcodeIcon className="w-3.5 h-3.5 text-purple-600" />
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditModal(p)}
                        className="h-8 text-xs font-semibold px-2.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteCandidate(p)}
                        className="h-8 text-xs font-semibold px-2.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Sticky Bulk Action Bar */}
      {selectedProductIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white dark:bg-zinc-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center">
              {selectedProductIds.size}
            </span>
            <span className="text-xs font-bold text-slate-200">
              Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleBulkRestock(10)}
              className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              +10 Stock All
            </Button>
            <Button
              size="sm"
              onClick={() => handleBulkRestock(50)}
              className="h-8 px-3 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white"
            >
              +50 Stock All
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              className="h-8 px-3 text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Selected
            </Button>
          </div>

          <button
            onClick={() => setSelectedProductIds(new Set())}
            className="text-xs text-slate-400 hover:text-white underline pl-2"
          >
            Clear
          </button>
        </div>
      )}

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
              <ModernSelect
                value={formData.categoryId}
                onChange={(val) =>
                  setFormData({ ...formData, categoryId: Number(val) })
                }
                size="lg"
                className="w-full"
                buttonClassName="w-full h-10"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Brand
              </label>
              <ModernSelect
                value={formData.brandId}
                onChange={(val) =>
                  setFormData({ ...formData, brandId: Number(val) })
                }
                size="lg"
                className="w-full"
                buttonClassName="w-full h-10"
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Selling Price ($) *
              </label>
              <Input
                required
                type="number"
                step="0.01"
                placeholder="999.00"
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
                placeholder="20"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              Specifications & Overview
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g. Intel Core i9-14900HX, RTX 4080 12GB, 32GB DDR5 RAM, 1TB NVMe SSD"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Multiple Image Gallery Management */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Product Image Gallery ({formData.images.length})
              </label>
              <span className="text-[11px] text-slate-400">
                First image acts as primary thumbnail
              </span>
            </div>

            {/* Direct File Upload from Computer / Google Drive */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700">
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="product-image-file-upload"
              />
              <label
                htmlFor="product-image-file-upload"
                className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-200 transition-colors shadow-xs"
              >
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <HardDrive className="w-4 h-4 text-blue-600" />
                )}
                <span>{uploadingImage ? "Uploading Image..." : "Upload from Computer / Drive"}</span>
              </label>
              <span className="text-[11px] text-slate-500 text-center sm:text-left">
                Supports JPG, PNG, WEBP, GIF up to 10MB
              </span>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-500 font-semibold">{uploadError}</p>
            )}

            {/* Add Image URL input */}
            <div className="flex gap-2">
              <Input
                placeholder="Or paste external image URL (e.g. https://...)"
                value={formData.newImageUrl}
                onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                className="text-xs h-9"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImageUrl}
                className="h-9 px-3 text-xs"
              >
                Add URL
              </Button>
            </div>

            {/* Thumbnail Previews */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group w-16 h-16 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden bg-slate-100 dark:bg-zinc-800"
                >
                  <img
                    src={normalizeImageUrl(img)}
                    alt={`Preview ${idx}`}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[9px] text-center font-bold">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="featured-checkbox"
              className="text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer"
            >
              Highlight as Featured Hardware on Homepage
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
              className="bg-blue-600 text-white"
            >
              {createProductMutation.isPending || updateProductMutation.isPending
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
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

      {/* Quick Restock Modal */}
      <Dialog
        open={!!restockProduct}
        onOpenChange={(open) => !open && setRestockProduct(null)}
      >
        <DialogHeader onClose={() => setRestockProduct(null)}>
          <DialogTitle>Quick Restock Inventory</DialogTitle>
          <DialogDescription>
            Add inventory stock units for {restockProduct?.name} ({restockProduct?.sku})
          </DialogDescription>
        </DialogHeader>

        {restockProduct && (
          <div className="space-y-4 py-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <span className="text-slate-500">Current Stock Level:</span>
              <span className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">
                {restockProduct.quantityOnHand} units
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Units to Add (+):
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRestockAmount(amt)}
                    className={`py-2 rounded-xl font-bold border text-xs transition-colors ${
                      restockAmount === amt
                        ? "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/40"
                        : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50"
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <Input
                type="number"
                value={restockAmount}
                onChange={(e) => setRestockAmount(parseInt(e.target.value, 10) || 0)}
                className="text-xs h-9 font-bold"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setRestockProduct(null)}>
            Cancel
          </Button>
          <Button onClick={submitSingleRestock} className="bg-emerald-600 text-white font-bold">
            Confirm Restock
          </Button>
        </DialogFooter>
      </Dialog>

      {/* CSV Import Modal */}
      <Dialog
        open={isImportModalOpen}
        onOpenChange={(open) => !open && setIsImportModalOpen(false)}
      >
        <DialogHeader onClose={() => setIsImportModalOpen(false)}>
          <DialogTitle>Bulk Import Products from CSV</DialogTitle>
          <DialogDescription>
            Upload a spreadsheet (.csv) containing product specifications to batch-create inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-4 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl text-center space-y-2 bg-slate-50 dark:bg-zinc-900/50">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-bold text-slate-800 dark:text-zinc-200">
              Select CSV Spreadsheet File
            </p>
            <p className="text-[11px] text-slate-400">
              Expected columns: SKU, Name, Category, Brand, Price, Stock
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvFileUpload}
              className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-xs cursor-pointer"
            />
          </div>

          {importParsedList.length > 0 && (
            <div>
              <p className="font-bold text-slate-800 dark:text-zinc-200 mb-2">
                Parsed Products Preview ({importParsedList.length} items ready):
              </p>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl">
                {importParsedList.map((item, i) => (
                  <div key={i} className="p-2.5 flex justify-between items-center bg-white dark:bg-zinc-900">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-zinc-100">{item.name}</p>
                      <p className="font-mono text-[10px] text-slate-400">{item.sku} • {item.categoryName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-zinc-100">{formatCurrency(item.price)}</p>
                      <p className="text-[10px] text-emerald-600">{item.quantityOnHand} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={executeBulkImport}
            disabled={importParsedList.length === 0 || isImporting}
            className="bg-emerald-600 text-white font-bold"
          >
            {isImporting ? "Importing..." : `Create ${importParsedList.length} Products`}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Barcode & Shelf Sticker Modal */}
      <ProductBarcodeModal
        product={barcodeProduct}
        isOpen={!!barcodeProduct}
        onClose={() => setBarcodeProduct(null)}
      />
    </div>
  );
}
