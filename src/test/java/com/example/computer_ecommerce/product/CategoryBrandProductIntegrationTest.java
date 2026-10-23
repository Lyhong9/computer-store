package com.example.computer_ecommerce.product;

import com.example.computer_ecommerce.brand.dto.BrandRequest;
import com.example.computer_ecommerce.brand.dto.BrandResponse;
import com.example.computer_ecommerce.brand.service.BrandService;
import com.example.computer_ecommerce.category.dto.CategoryRequest;
import com.example.computer_ecommerce.category.dto.CategoryResponse;
import com.example.computer_ecommerce.category.service.CategoryService;
import com.example.computer_ecommerce.product.dto.ProductRequest;
import com.example.computer_ecommerce.product.dto.ProductResponse;
import com.example.computer_ecommerce.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CategoryBrandProductIntegrationTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private ProductService productService;

    @Test
    void testCategoryBrandProductRelations() {
        // 1. Create Brand
        BrandResponse brand = brandService.create(new BrandRequest(
                "Apple",
                "Apple Inc. computers and accessories",
                null
        ));
        assertNotNull(brand.id());
        assertEquals("Apple", brand.name());

        // 2. Create Category associated with Brand
        CategoryResponse category = categoryService.create(new CategoryRequest(
                "Laptops",
                "Portable laptops and notebooks",
                Set.of(brand.id())
        ));
        assertNotNull(category.id());
        assertEquals("Laptops", category.name());
        assertEquals(1, category.brands().size());

        // 3. Create Product linked to Category and Brand
        ProductResponse product = productService.create(new ProductRequest(
                "MBP-14-M3",
                "MacBook Pro 14",
                "14-inch M3 Pro Laptop",
                new BigDecimal("1999.00"),
                15,
                category.id(),
                brand.id()
        ));

        assertNotNull(product.id());
        assertEquals("MBP-14-M3", product.sku());
        assertEquals(category.id(), product.categoryId());
        assertEquals("Laptops", product.categoryName());
        assertEquals(brand.id(), product.brandId());
        assertEquals("Apple", product.brandName());

        // 4. Query products by Category and Brand
        List<ProductResponse> filtered = productService.findAll(category.id(), brand.id());
        assertEquals(1, filtered.size());
        assertEquals(product.id(), filtered.get(0).id());

        // 5. Query products by Category only
        List<ProductResponse> byCategory = productService.findAll(category.id(), null);
        assertEquals(1, byCategory.size());

        // 6. Query products by Brand only
        List<ProductResponse> byBrand = productService.findAll(null, brand.id());
        assertEquals(1, byBrand.size());
    }
}
