package com.example.computer_ecommerce.product.mapper;

import com.example.computer_ecommerce.product.dto.ProductRequest;
import com.example.computer_ecommerce.product.dto.ProductResponse;
import com.example.computer_ecommerce.product.entity.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {
        Product product = new Product();
        updateEntity(product, request);
        return product;
    }

    public void updateEntity(Product product, ProductRequest request) {
        product.setSku(request.sku());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        if (request.originalPrice() != null) {
            product.setOriginalPrice(request.originalPrice());
        }
        if (request.primaryImage() != null && !request.primaryImage().isBlank()) {
            product.setPrimaryImage(request.primaryImage());
        } else if (request.images() != null && !request.images().isEmpty()) {
            product.setPrimaryImage(request.images().get(0));
        }
        if (request.images() != null) {
            product.setImages(new ArrayList<>(request.images()));
        }
        if (request.featured() != null) {
            product.setFeatured(request.featured());
        }
        if (request.badge() != null) {
            product.setBadge(request.badge());
        }
        if (request.rating() != null) {
            product.setRating(request.rating());
        }
        if (request.reviewCount() != null) {
            product.setReviewCount(request.reviewCount());
        }
        product.setQuantityOnHand(request.quantityOnHand());
    }

    public ProductResponse toResponse(Product product) {
        Long categoryId = product.getCategory() != null ? product.getCategory().getId() : null;
        String categoryName = product.getCategory() != null ? product.getCategory().getName() : null;
        Long brandId = product.getBrand() != null ? product.getBrand().getId() : null;
        String brandName = product.getBrand() != null ? product.getBrand().getName() : null;

        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getPrimaryImage(),
                product.getImages(),
                product.isFeatured(),
                product.getBadge(),
                product.getRating() != null ? product.getRating() : BigDecimal.valueOf(5.0),
                product.getReviewCount() != null ? product.getReviewCount() : 0,
                product.getQuantityOnHand(),
                product.isActive(),
                categoryId,
                categoryName,
                brandId,
                brandName);
    }
}
