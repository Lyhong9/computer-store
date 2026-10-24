import { getOrSetUserRole } from "@/lib/auth";
import { StorefrontClient } from "@/components/StorefrontClient";
import { INITIAL_PRODUCTS, CATEGORIES, BRANDS } from "@/data/sampleProducts";
import { Brand, Category, Product } from "@/types/store";
import { normalizeImageUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  await getOrSetUserRole();

  let products: Product[] = INITIAL_PRODUCTS;
  let categories: Category[] = CATEGORIES;
  let brands: Brand[] = BRANDS;
  let isBackendConnected = false;

  try {
    const [prodRes, catRes, brandRes] = await Promise.all([
      fetch("http://localhost:8083/api/products", {
        cache: "no-store",
        next: { revalidate: 0 },
      }),
      fetch("http://localhost:8083/api/categories", {
        cache: "no-store",
        next: { revalidate: 0 },
      }),
      fetch("http://localhost:8083/api/brands", {
        cache: "no-store",
        next: { revalidate: 0 },
      }),
    ]);

    if (prodRes.ok) {
      const liveProducts = await prodRes.json();
      if (Array.isArray(liveProducts) && liveProducts.length > 0) {
        const SKU_IMAGE_MAP: Record<string, string> = {
          "RTX-4090-ROG": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
          "RTX-4070TI-SUPER": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
          "AMD-7950X3D": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
          "INTEL-14900K": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
          "DELL-U3223QE": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
          "LOGI-GPRO-X2": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
          "CORSAIR-DOM-64": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
          "MBP-16-M3": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
          "MBA-15-M3": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
          "MBP-16-M3MAX": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
          "ASUS-G16-4080": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
        };

        const mappedBackend = liveProducts.map((p: any) => {
          const sample = INITIAL_PRODUCTS.find((s) => s.sku === p.sku);
          const customImg = normalizeImageUrl(
            SKU_IMAGE_MAP[p.sku] || sample?.primaryImage || p.primaryImage
          );
          return {
            id: p.id,
            sku: p.sku,
            name: p.name,
            description: p.description || sample?.description || "",
            price: Number(p.price),
            originalPrice: sample?.originalPrice,
            badge: sample?.badge,
            rating: sample?.rating || 5,
            quantityOnHand: p.quantityOnHand ?? 10,
            active: p.active ?? true,
            categoryId: p.categoryId,
            categoryName: p.categoryName || sample?.categoryName || "Hardware",
            brandId: p.brandId,
            brandName: p.brandName || sample?.brandName || "Premium",
            primaryImage: customImg,
            images: [customImg],
            specs: sample?.specs || {
              SKU: p.sku,
              Status: "In Stock",
              Warranty: "3 Years Official",
            },
            featured: sample?.featured ?? false,
          };
        });

        const missingSamples = INITIAL_PRODUCTS.filter(
          (s) => !mappedBackend.some((b: any) => b.sku === s.sku)
        );
        products = [...mappedBackend, ...missingSamples];
        isBackendConnected = true;
      }
    }
  } catch {
    isBackendConnected = false;
  }

  return (
    <StorefrontClient
      initialProducts={products}
      categories={categories}
      brands={brands}
      isBackendConnected={isBackendConnected}
      defaultTab="shop"
    />
  );
}
