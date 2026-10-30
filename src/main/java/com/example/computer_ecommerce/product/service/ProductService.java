package com.example.computer_ecommerce.product.service;

import com.example.computer_ecommerce.brand.entity.Brand;
import com.example.computer_ecommerce.brand.repository.BrandRepository;
import com.example.computer_ecommerce.category.entity.Category;
import com.example.computer_ecommerce.category.repository.CategoryRepository;
import com.example.computer_ecommerce.product.dto.ProductRequest;
import com.example.computer_ecommerce.product.dto.ProductResponse;
import com.example.computer_ecommerce.product.entity.Product;
import com.example.computer_ecommerce.product.mapper.ProductMapper;
import com.example.computer_ecommerce.product.repository.ProductRepository;
import com.example.computer_ecommerce.product.repository.ProductSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository products;
    private final CategoryRepository categories;
    private final BrandRepository brands;
    private final ProductMapper mapper;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    public ProductService(
            ProductRepository products,
            CategoryRepository categories,
            BrandRepository brands,
            ProductMapper mapper) {
        this.products = products;
        this.categories = categories;
        this.brands = brands;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll(
            String search,
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean featured) {

        Specification<Product> spec = buildSpecification(search, categoryId, brandId, minPrice, maxPrice, featured);
        List<Product> result = products.findAll(spec);
        return result.stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll(Long categoryId, Long brandId) {
        return findAll(null, categoryId, brandId, null, null, null);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return findAll(null, null, null, null, null, null);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> search(
            String search,
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean featured,
            Pageable pageable) {

        Specification<Product> spec = buildSpecification(search, categoryId, brandId, minPrice, maxPrice, featured);
        return products.findAll(spec, pageable).map(mapper::toResponse);
    }

    private Specification<Product> buildSpecification(
            String search,
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean featured) {

        Specification<Product> spec = Specification.where(ProductSpecification.activeOnly(true));

        if (search != null && !search.isBlank()) {
            spec = spec.and(ProductSpecification.search(search));
        }
        if (categoryId != null) {
            spec = spec.and(ProductSpecification.categoryId(categoryId));
        }
        if (brandId != null) {
            spec = spec.and(ProductSpecification.brandId(brandId));
        }
        if (minPrice != null || maxPrice != null) {
            spec = spec.and(ProductSpecification.priceBetween(minPrice, maxPrice));
        }
        if (featured != null) {
            spec = spec.and(ProductSpecification.featured(featured));
        }

        return spec;
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return mapper.toResponse(getProduct(id));
    }

    public ProductResponse create(ProductRequest request) {
        Product product = mapper.toEntity(request);
        product.setCategory(getOptionalCategory(request.categoryId()));
        product.setBrand(getOptionalBrand(request.brandId()));
        return mapper.toResponse(products.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getProduct(id);
        mapper.updateEntity(product, request);
        product.setCategory(getOptionalCategory(request.categoryId()));
        product.setBrand(getOptionalBrand(request.brandId()));
        return mapper.toResponse(product);
    }

    public ProductResponse restock(Long id, Integer amount) {
        Product product = getProduct(id);
        int current = product.getQuantityOnHand();
        product.setQuantityOnHand(Math.max(0, current + (amount != null ? amount : 0)));
        return mapper.toResponse(product);
    }

    public void delete(Long id) {
        Product product = getProduct(id);
        if (entityManager != null) {
            entityManager.createNativeQuery("UPDATE customer_order_items SET product_id = NULL WHERE product_id = :id")
                    .setParameter("id", id)
                    .executeUpdate();
            entityManager.createNativeQuery("DELETE FROM sale_items WHERE product_id = :id")
                    .setParameter("id", id)
                    .executeUpdate();
        }
        products.delete(product);
    }

    private Product getProduct(Long id) {
        return products.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }

    private Category getOptionalCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categories.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryId));
    }

    private Brand getOptionalBrand(Long brandId) {
        if (brandId == null) {
            return null;
        }
        return brands.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + brandId));
    }
}
