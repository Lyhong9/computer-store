package com.example.computer_ecommerce.product.mapper;

import com.example.computer_ecommerce.product.dto.ProductRequest;
import com.example.computer_ecommerce.product.dto.ProductResponse;
import com.example.computer_ecommerce.product.entity.Product;
import org.springframework.stereotype.Component;

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
                product.getQuantityOnHand(),
                product.isActive(),
                categoryId,
                categoryName,
                brandId,
                brandName);
    }
}
