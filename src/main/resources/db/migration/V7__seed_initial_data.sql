-- V7: Seed initial categories, brands, and catalog products

-- 1. Insert Brands
INSERT INTO brands (name, description, active) VALUES
('Apple', 'Apple Inc. MacBooks, hardware, and premium accessories', true),
('ASUS ROG', 'ASUS Republic of Gamers - laptops, motherboards, and graphics cards', true),
('NVIDIA', 'NVIDIA GeForce GPUs, AI accelerators, and graphics architecture', true),
('AMD', 'Advanced Micro Devices - Ryzen CPUs, Radeon GPUs, and processors', true),
('Intel', 'Intel Core processors, compute units, and arc technologies', true),
('Corsair', 'High-performance gaming memory, cooling, and power supplies', true),
('Logitech', 'Industry-leading esports peripherals, keyboards, and mice', true),
('Dell', 'Dell workstations, precision laptops, and UltraSharp displays', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categories (name, description, active) VALUES
('Laptops', 'Gaming laptops, ultra-portables, and mobile workstations', true),
('Desktops', 'High-performance pre-built PCs and creator workstations', true),
('Graphics Cards', 'Dedicated GPUs for 4K gaming, rendering, and AI computing', true),
('Processors', 'Desktop CPUs for high-performance multi-threading and gaming', true),
('Monitors', 'High-refresh OLED, 4K UHD, and professional color displays', true),
('Accessories', 'Mechanical keyboards, lightweight mice, RAM, and gaming headsets', true)
ON CONFLICT (name) DO NOTHING;

-- 3. Link Categories and Brands
INSERT INTO category_brands (category_id, brand_id)
SELECT c.id, b.id
FROM categories c, brands b
WHERE (c.name = 'Laptops' AND b.name IN ('Apple', 'ASUS ROG', 'Dell'))
   OR (c.name = 'Desktops' AND b.name IN ('Apple', 'ASUS ROG', 'Corsair'))
   OR (c.name = 'Graphics Cards' AND b.name IN ('ASUS ROG', 'NVIDIA', 'AMD'))
   OR (c.name = 'Processors' AND b.name IN ('AMD', 'Intel'))
   OR (c.name = 'Monitors' AND b.name IN ('ASUS ROG', 'Dell'))
   OR (c.name = 'Accessories' AND b.name IN ('Corsair', 'Logitech', 'Apple'))
ON CONFLICT DO NOTHING;

-- 4. Insert Products
INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'MBP-16-M3MAX',
    'MacBook Pro 16" M3 Max',
    '16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD Liquid Retina XDR display.',
    3499.00,
    15,
    true,
    (SELECT id FROM categories WHERE name = 'Laptops'),
    (SELECT id FROM brands WHERE name = 'Apple')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MBP-16-M3MAX');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'ASUS-G16-4080',
    'ASUS ROG Zephyrus G16',
    'Intel Core Ultra 9 185H, RTX 4080 12GB, 32GB DDR5, 1TB NVMe, 2.5K 240Hz OLED.',
    2499.99,
    20,
    true,
    (SELECT id FROM categories WHERE name = 'Laptops'),
    (SELECT id FROM brands WHERE name = 'ASUS ROG')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ASUS-G16-4080');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'RTX-4090-ROG',
    'ASUS ROG Strix GeForce RTX 4090 OC',
    '24GB GDDR6X, Ada Lovelace architecture, DLSS 3, Axial-tech cooling fans.',
    1999.00,
    8,
    true,
    (SELECT id FROM categories WHERE name = 'Graphics Cards'),
    (SELECT id FROM brands WHERE name = 'ASUS ROG')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RTX-4090-ROG');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'RTX-4070TI-SUPER',
    'NVIDIA GeForce RTX 4070 Ti SUPER Founders',
    '16GB GDDR6X, 8448 CUDA Cores, Dual BIOS, AV1 Encode, Ray Tracing Gen 3.',
    849.99,
    25,
    true,
    (SELECT id FROM categories WHERE name = 'Graphics Cards'),
    (SELECT id FROM brands WHERE name = 'NVIDIA')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RTX-4070TI-SUPER');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'AMD-7950X3D',
    'AMD Ryzen 9 7950X3D Desktop Processor',
    '16 Cores, 32 Threads, 144MB 3D V-Cache, up to 5.7GHz Boost, AM5 Socket.',
    599.00,
    30,
    true,
    (SELECT id FROM categories WHERE name = 'Processors'),
    (SELECT id FROM brands WHERE name = 'AMD')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AMD-7950X3D');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'INTEL-14900K',
    'Intel Core i9-14900K Desktop Processor',
    '24 Cores (8P + 16E), 32 Threads, up to 6.0GHz Turbo, LGA1700 Socket.',
    549.99,
    35,
    true,
    (SELECT id FROM categories WHERE name = 'Processors'),
    (SELECT id FROM brands WHERE name = 'Intel')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'INTEL-14900K');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'DELL-U3223QE',
    'Dell UltraSharp 32" 4K USB-C Hub Monitor',
    'IPS Black technology, 3840x2160, 98% DCI-P3, 90W Power Delivery, KVM Switch.',
    799.99,
    18,
    true,
    (SELECT id FROM categories WHERE name = 'Monitors'),
    (SELECT id FROM brands WHERE name = 'Dell')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DELL-U3223QE');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'LOGI-GPRO-X2',
    'Logitech G PRO X SUPERLIGHT 2 Wireless Mouse',
    'HERO 2 Sensor 32,000 DPI, LIGHTFORCE Hybrid Optical Switches, 60g Ultralight.',
    159.99,
    50,
    true,
    (SELECT id FROM categories WHERE name = 'Accessories'),
    (SELECT id FROM brands WHERE name = 'Logitech')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LOGI-GPRO-X2');

INSERT INTO products (sku, name, description, price, quantity_on_hand, active, category_id, brand_id)
SELECT 
    'CORSAIR-DOM-64',
    'Corsair Dominator Titanium RGB 64GB DDR5',
    '2x32GB DDR5 6000MHz CL30, Intel XMP & AMD EXPO compatible, DHX Cooling.',
    289.99,
    40,
    true,
    (SELECT id FROM categories WHERE name = 'Accessories'),
    (SELECT id FROM brands WHERE name = 'Corsair')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CORSAIR-DOM-64');
