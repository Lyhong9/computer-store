package com.example.computer_ecommerce.sales.entity;

import java.io.Serializable;
import java.util.Objects;

public class SaleItemId implements Serializable {

    private Long sale;
    private Long product;

    public SaleItemId() {
    }

    public SaleItemId(Long sale, Long product) {
        this.sale = sale;
        this.product = product;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof SaleItemId that)) {
            return false;
        }
        return Objects.equals(sale, that.sale) && Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sale, product);
    }
}
