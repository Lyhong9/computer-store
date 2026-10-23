"use client";

import { useMemo, useState } from "react";
import { Brand, Category, Product } from "@/types/store";
import { useCart } from "@/context/CartContext";
import { ProductQuickViewModal } from "./ProductQuickViewModal";

interface StoreCatalogProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  isBackendConnected?: boolean;
}

export function StoreCatalog({
  initialProducts,
  categories,
  brands,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  isBackendConnected = true,
}: StoreCatalogProps) {
  const { addToCart } = useCart();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (
          selectedCategory !== "all" &&
          product.categoryName?.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Brand filter
        if (
          selectedBrand !== "all" &&
          product.brandName?.toLowerCase() !== selectedBrand.toLowerCase()
        ) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesSku = product.sku.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesBrand = product.brandName?.toLowerCase().includes(q);
          if (!matchesName && !matchesSku && !matchesDesc && !matchesBrand) {
            return false;
          }
        }

        // In-stock filter
        if (onlyInStock && product.quantityOnHand <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "stock-desc") return b.quantityOnHand - a.quantityOnHand;
        // Default: featured first, then id
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [initialProducts, selectedCategory, selectedBrand, searchQuery, onlyInStock, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1000);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" id="catalog-section">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-zinc-800/80 mb-8">
        <button
          onClick={() => onSelectCategory("all")}
          id="cat-pill-all"
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
            selectedCategory === "all"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
          }`}
        >
          <span>🔥</span>
          <span>All Hardware</span>
          <span className="text-[11px] opacity-70">({initialProducts.length})</span>
        </button>

        {categories.map((cat) => {
          const count = initialProducts.filter(
            (p) => p.categoryName?.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              id={`cat-pill-${cat.id}`}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
              }`}
            >
              <span>{cat.icon || "💻"}</span>
              <span>{cat.name}</span>
              <span className="text-[11px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Brand Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-xs text-zinc-500 font-semibold mr-1 shrink-0">Brand:</span>
          <button
            onClick={() => setSelectedBrand("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedBrand === "all"
                ? "bg-zinc-100 text-zinc-900 font-bold"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.name)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedBrand.toLowerCase() === b.name.toLowerCase()
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Sort and In Stock controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* In Stock toggle */}
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-0"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-products-select"
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-desc">Highest Stock</option>
          </select>
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-6">
        <div>
          Showing <span className="font-bold text-white">{filteredProducts.length}</span> hardware items
          {searchQuery && (
            <span>
              {" "}
              matching &ldquo;<span className="text-indigo-400">{searchQuery}</span>&rdquo;
            </span>
          )}
        </div>

        {/* Backend live status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          ></span>
          <span className="text-[11px] text-zinc-400">
            {isBackendConnected
              ? "Spring Boot Live API Connected"
              : "Demo Mode Active"}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 my-8">
          <span className="text-4xl">🔍</span>
          <h3 className="mt-3 text-lg font-bold text-white">No products found</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            We couldn&apos;t find any hardware matching your current filter or search criteria.
          </p>
          <button
            onClick={() => {
              onSelectCategory("all");
              setSelectedBrand("all");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.brandName && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {product.brandName}
                        </span>
                      )}
                      {product.categoryName && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800/80 text-zinc-300">
                          {product.categoryName}
                        </span>
                      )}
                    </div>

                    {/* Stock badge */}
                    {product.quantityOnHand > 10 ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        In Stock ({product.quantityOnHand})
                      </span>
                    ) : product.quantityOnHand > 0 ? (
                      <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Only {product.quantityOnHand} left
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-red-400">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Product Image & Multi-Image Gallery preview */}
                  {(() => {
                    const imgList =
                      product.images && product.images.length > 0
                        ? product.images
                        : product.primaryImage
                        ? [product.primaryImage]
                        : ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"];

                    return (
                      <div
                        onClick={() => setQuickViewProduct(product)}
                        className="relative h-44 w-full rounded-2xl overflow-hidden bg-zinc-950/80 mb-3 cursor-pointer group/img border border-zinc-800/80"
                      >
                        <img
                          src={imgList[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        {imgList.length > 1 && (
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-white font-semibold">
                            <span>📷</span>
                            <span>{imgList.length} photos</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Product Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  {/* SKU */}
                  <span className="text-[11px] font-mono text-zinc-500 block mt-1">
                    SKU: {product.sku}
                  </span>

                  {/* Description snippet */}
                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Highlight Specs Pill preview */}
                  {product.specs && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {Object.entries(product.specs)
                        .slice(0, 2)
                        .map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded-md bg-zinc-950 text-[10px] text-zinc-400 border border-zinc-850"
                          >
                            {v}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Price & Actions */}
                <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                      Price
                    </span>
                    <span className="text-xl font-extrabold text-white tracking-tight">
                      ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Specs View */}
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="p-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-400 text-xs font-semibold transition-colors"
                      title="View Full Specifications"
                    >
                      Specs
                    </button>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      id={`add-to-cart-${product.id}`}
                      disabled={isAdded || product.quantityOnHand <= 0}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 disabled:opacity-50"
                      }`}
                    >
                      {isAdded ? (
                        <span>✓ Added</span>
                      ) : (
                        <>
                          <span>🛒</span>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
