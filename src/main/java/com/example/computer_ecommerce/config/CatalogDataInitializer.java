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
import java.util.HashMap;
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
                        "Accessories", "Mechanical keyboards, lightweight mice, RAM, and gaming headsets"
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

                // 3. Seed Products if missing
                seedProductIfMissing(productRepo, "MBP-16-M3MAX", "MacBook Pro 16\" M3 Max",
                        "16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD Liquid Retina XDR display.",
                        new BigDecimal("3499.00"), 15, categories.get("Laptops"), brands.get("Apple"));

                seedProductIfMissing(productRepo, "ASUS-G16-4080", "ASUS ROG Zephyrus G16",
                        "Intel Core Ultra 9 185H, RTX 4080 12GB, 32GB DDR5, 1TB NVMe, 2.5K 240Hz OLED.",
                        new BigDecimal("2499.99"), 20, categories.get("Laptops"), brands.get("ASUS ROG"));

                seedProductIfMissing(productRepo, "RTX-4090-ROG", "ASUS ROG Strix GeForce RTX 4090 OC",
                        "24GB GDDR6X, Ada Lovelace architecture, DLSS 3, Axial-tech fans, diecast frame.",
                        new BigDecimal("1999.00"), 8, categories.get("Graphics Cards"), brands.get("ASUS ROG"));

                seedProductIfMissing(productRepo, "RTX-4070TI-SUPER", "NVIDIA GeForce RTX 4070 Ti SUPER Founders",
                        "16GB GDDR6X, 8448 CUDA Cores, Dual BIOS, AV1 Encode, 3rd Gen RT Cores.",
                        new BigDecimal("849.99"), 25, categories.get("Graphics Cards"), brands.get("NVIDIA"));

                seedProductIfMissing(productRepo, "AMD-7950X3D", "AMD Ryzen 9 7950X3D Desktop Processor",
                        "16 Cores, 32 Threads, 144MB 3D V-Cache, up to 5.7GHz Max Boost, AM5 Socket.",
                        new BigDecimal("599.00"), 30, categories.get("Processors"), brands.get("AMD"));

                seedProductIfMissing(productRepo, "INTEL-14900K", "Intel Core i9-14900K Desktop Processor",
                        "24 Cores (8P + 16E), 32 Threads, up to 6.0GHz Turbo, LGA1700 Socket.",
                        new BigDecimal("549.99"), 35, categories.get("Processors"), brands.get("Intel"));

                seedProductIfMissing(productRepo, "DELL-U3223QE", "Dell UltraSharp 32\" 4K USB-C Hub Monitor",
                        "IPS Black technology, 3840x2160 4K UHD, 98% DCI-P3, 90W Power Delivery, KVM.",
                        new BigDecimal("799.99"), 18, categories.get("Monitors"), brands.get("Dell"));

                seedProductIfMissing(productRepo, "LOGI-GPRO-X2", "Logitech G PRO X SUPERLIGHT 2 Mouse",
                        "HERO 2 Sensor 32,000 DPI, LIGHTFORCE Switches, 60g ultralight, 95h battery.",
                        new BigDecimal("159.99"), 50, categories.get("Accessories"), brands.get("Logitech"));

                seedProductIfMissing(productRepo, "CORSAIR-DOM-64", "Corsair Dominator Titanium RGB 64GB DDR5",
                        "2x32GB DDR5 6000MHz CL30, patented DHX cooling, customizable top bars, XMP 3.0.",
                        new BigDecimal("289.99"), 40, categories.get("Accessories"), brands.get("Corsair"));

                log.info("Catalog seed check completed. Total products in store: {}", productRepo.count());
            }
        };
    }

    private void seedProductIfMissing(
            ProductRepository productRepo,
            String sku,
            String name,
            String description,
            BigDecimal price,
            int quantityOnHand,
            Category category,
            Brand brand) {

        if (!productRepo.existsBySku(sku)) {
            Product p = new Product();
            p.setSku(sku);
            p.setName(name);
            p.setDescription(description);
            p.setPrice(price);
            p.setQuantityOnHand(quantityOnHand);
            p.setActive(true);
            p.setCategory(category);
            p.setBrand(brand);
            productRepo.save(p);
            log.info("Seeded catalog product: {} ({})", name, sku);
        }
    }
}
