package com.example.computer_ecommerce.product.repository;

import com.example.computer_ecommerce.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> search(String query) {
        if (query == null || query.isBlank()) {
            return null;
        }
        String pattern = "%" + query.trim().toLowerCase() + "%";
        return (root, cq, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("sku")), pattern),
                cb.like(cb.lower(cb.coalesce(root.get("description"), "")), pattern)
        );
    }

    public static Specification<Product> categoryId(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return (root, cq, cb) -> cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> brandId(Long brandId) {
        if (brandId == null) {
            return null;
        }
        return (root, cq, cb) -> cb.equal(root.get("brand").get("id"), brandId);
    }

    public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {
        if (min == null && max == null) {
            return null;
        }
        return (root, cq, cb) -> {
            if (min != null && max != null) {
                return cb.between(root.get("price"), min, max);
            } else if (min != null) {
                return cb.greaterThanOrEqualTo(root.get("price"), min);
            } else {
                return cb.lessThanOrEqualTo(root.get("price"), max);
            }
        };
    }

    public static Specification<Product> featured(Boolean featured) {
        if (featured == null) {
            return null;
        }
        return (root, cq, cb) -> cb.equal(root.get("featured"), featured);
    }

    public static Specification<Product> activeOnly(Boolean active) {
        if (active == null) {
            return (root, cq, cb) -> cb.isTrue(root.get("active"));
        }
        return (root, cq, cb) -> cb.equal(root.get("active"), active);
    }
}
