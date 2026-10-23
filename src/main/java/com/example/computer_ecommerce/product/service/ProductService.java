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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository products;
    private final CategoryRepository categories;
    private final BrandRepository brands;
    private final ProductMapper mapper;

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
    public List<ProductResponse> findAll(Long categoryId, Long brandId) {
        List<Product> result;
        if (categoryId != null && brandId != null) {
            result = products.findByCategoryIdAndBrandId(categoryId, brandId);
        } else if (categoryId != null) {
            result = products.findByCategoryId(categoryId);
        } else if (brandId != null) {
            result = products.findByBrandId(brandId);
        } else {
            result = products.findAll();
        }
        return result.stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return findAll(null, null);
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

    public void delete(Long id) {
        products.delete(getProduct(id));
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

