package com.example.computer_ecommerce.config;

import com.example.computer_ecommerce.brand.entity.Brand;
import com.example.computer_ecommerce.brand.repository.BrandRepository;
import com.example.computer_ecommerce.category.entity.Category;
import com.example.computer_ecommerce.category.repository.CategoryRepository;
import com.example.computer_ecommerce.product.entity.Product;
import com.example.computer_ecommerce.product.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@org.springframework.context.annotation.Profile("!test")
public class CatalogDataInitializer {

    private static final Logger log = LoggerFactory.getLogger(CatalogDataInitializer.class);

    @Bean
    CommandLineRunner seedCatalogData(
            CategoryRepository categoryRepo,
            BrandRepository brandRepo,
            ProductRepository productRepo) {
        return new CommandLineRunner() {
            @Override
            @Transactional
            public void run(String... args) {
                log.info("Checking catalog seed data...");

                // 1. Seed Brands
                Map<String, String> brandData = Map.of(
                        "Apple", "Apple Inc. MacBooks, hardware, and premium accessories",
                        "ASUS ROG", "ASUS Republic of Gamers - laptops and graphics cards",
                        "NVIDIA", "NVIDIA GeForce GPUs, AI accelerators, and graphics architecture",
                        "AMD", "Advanced Micro Devices - Ryzen CPUs, Radeon GPUs",
                        "Intel", "Intel Core processors and compute units",
                        "Corsair", "High-performance gaming memory, cooling, and power supplies",
                        "Logitech", "Industry-leading esports peripherals, keyboards, and mice",
                        "Dell", "Dell workstations, precision laptops, and UltraSharp displays"
                );

                Map<String, Brand> brands = new HashMap<>();
                for (Map.Entry<String, String> entry : brandData.entrySet()) {
                    Brand brand = brandRepo.findByName(entry.getKey()).orElseGet(() -> {
                        Brand b = new Brand(entry.getKey(), entry.getValue());
                        return brandRepo.save(b);
                    });
                    brands.put(entry.getKey(), brand);
                }

                // 2. Seed Categories
                Map<String, String> categoryData = Map.of(
                        "Laptops", "Gaming laptops, ultra-portables, and mobile workstations",
                        "Desktops", "High-performance pre-built PCs and creator workstations",
                        "Graphics Cards", "Dedicated GPUs for 4K gaming, rendering, and AI computing",
                        "Processors", "Desktop CPUs for high-performance multi-threading and gaming",
                        "Monitors", "High-refresh OLED, 4K UHD, and professional color displays",
                        "Accessories", "Mechanical keyboards, lightweight mice, RAM, and gaming headsets",
                        "Mobile", "Flagship smartphones, 5G devices, and mobile technology",
                        "Audio", "Studio headphones, wireless earbuds, and Hi-Fi speakers"
                );

                Map<String, Category> categories = new HashMap<>();
                for (Map.Entry<String, String> entry : categoryData.entrySet()) {
                    Category cat = categoryRepo.findByName(entry.getKey()).orElseGet(() -> {
                        Category c = new Category();
                        c.setName(entry.getKey());
                        c.setDescription(entry.getValue());
                        return categoryRepo.save(c);
                    });
                    categories.put(entry.getKey(), cat);
                }

                // 3. Seed Products with rich media, deals, and ratings (Set to $0.10 for real payment testing)
                seedProduct(productRepo, "MBP-16-M3MAX", "MacBook Pro 16\" M3 Max",
                        "16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD Liquid Retina XDR display.",
                        new BigDecimal("0.10"), new BigDecimal("3899.00"),
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"),
                        true, "HOT", new BigDecimal("5.0"), 48, 15, categories.get("Laptops"), brands.get("Apple"));

                seedProduct(productRepo, "ASUS-G16-4080", "ASUS ROG Zephyrus G16",
                        "Intel Core Ultra 9 185H, RTX 4080 12GB, 32GB DDR5, 1TB NVMe, 2.5K 240Hz OLED.",
                        new BigDecimal("0.10"), new BigDecimal("2799.00"),
                        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80"),
                        true, "SALE", new BigDecimal("4.9"), 36, 20, categories.get("Laptops"), brands.get("ASUS ROG"));

                seedProduct(productRepo, "RTX-4090-ROG", "ASUS ROG Strix GeForce RTX 4090 OC",
                        "24GB GDDR6X, Ada Lovelace architecture, DLSS 3, Axial-tech fans, diecast frame.",
                        new BigDecimal("0.10"), new BigDecimal("2299.00"),
                        "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"),
                        true, "HOT", new BigDecimal("5.0"), 82, 8, categories.get("Graphics Cards"), brands.get("ASUS ROG"));

                seedProduct(productRepo, "RTX-4070TI-SUPER", "NVIDIA GeForce RTX 4070 Ti SUPER Founders",
                        "16GB GDDR6X, 8448 CUDA Cores, Dual BIOS, AV1 Encode, 3rd Gen RT Cores.",
                        new BigDecimal("0.10"), new BigDecimal("899.99"),
                        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80"),
                        false, "NEW", new BigDecimal("4.8"), 29, 25, categories.get("Graphics Cards"), brands.get("NVIDIA"));

                seedProduct(productRepo, "AMD-7950X3D", "AMD Ryzen 9 7950X3D Desktop Processor",
                        "16 Cores, 32 Threads, 144MB 3D V-Cache, up to 5.7GHz Max Boost, AM5 Socket.",
                        new BigDecimal("0.10"), new BigDecimal("699.00"),
                        "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"),
                        true, "SALE", new BigDecimal("4.9"), 64, 30, categories.get("Processors"), brands.get("AMD"));

                seedProduct(productRepo, "INTEL-14900K", "Intel Core i9-14900K Desktop Processor",
                        "24 Cores (8P + 16E), 32 Threads, up to 6.0GHz Turbo, LGA1700 Socket.",
                        new BigDecimal("0.10"), new BigDecimal("599.99"),
                        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80"),
                        false, null, new BigDecimal("4.7"), 41, 35, categories.get("Processors"), brands.get("Intel"));

                seedProduct(productRepo, "DELL-U3223QE", "Dell UltraSharp 32\" 4K USB-C Hub Monitor",
                        "IPS Black technology, 3840x2160 4K UHD, 98% DCI-P3, 90W Power Delivery, KVM.",
                        new BigDecimal("0.10"), new BigDecimal("899.99"),
                        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"),
                        true, "HOT", new BigDecimal("4.9"), 53, 18, categories.get("Monitors"), brands.get("Dell"));

                seedProduct(productRepo, "LOGI-GPRO-X2", "Logitech G PRO X SUPERLIGHT 2 Mouse",
                        "HERO 2 Sensor 32,000 DPI, LIGHTFORCE Switches, 60g ultralight, 95h battery.",
                        new BigDecimal("0.10"), new BigDecimal("179.99"),
                        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80"),
                        false, "NEW", new BigDecimal("4.8"), 95, 50, categories.get("Accessories"), brands.get("Logitech"));

                seedProduct(productRepo, "CORSAIR-DOM-64", "Corsair Dominator Titanium RGB 64GB DDR5",
                        "2x32GB DDR5 6000MHz CL30, patented DHX cooling, customizable top bars, XMP 3.0.",
                        new BigDecimal("0.10"), new BigDecimal("329.99"),
                        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
                        List.of("https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80"),
                        false, null, new BigDecimal("4.9"), 22, 40, categories.get("Accessories"), brands.get("Corsair"));


                log.info("Catalog seed check completed. Total products in store: {}", productRepo.count());
            }
        };
    }

    private void seedProduct(
            ProductRepository productRepo,
            String sku,
            String name,
            String description,
            BigDecimal price,
            BigDecimal originalPrice,
            String primaryImage,
            List<String> images,
            boolean featured,
            String badge,
            BigDecimal rating,
            int reviewCount,
            int quantityOnHand,
            Category category,
            Brand brand) {

        Product p = productRepo.findAll().stream()
                .filter(item -> item.getSku() != null && item.getSku().equalsIgnoreCase(sku))
                .findFirst()
                .orElseGet(() -> {
                    Product newP = new Product();
                    newP.setSku(sku);
                    return newP;
                });

        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setOriginalPrice(originalPrice);
        p.setPrimaryImage(primaryImage);
        p.setImages(images != null ? new ArrayList<>(images) : new ArrayList<>(List.of(primaryImage)));
        p.setFeatured(featured);
        p.setBadge(badge);
        p.setRating(rating);
        p.setReviewCount(reviewCount);
        p.setQuantityOnHand(quantityOnHand);
        p.setActive(true);
        if (category != null) p.setCategory(category);
        if (brand != null) p.setBrand(brand);

        productRepo.save(p);
        log.info("Initialized catalog product: {} ({}) with media and pricing", name, sku);
    }
}
