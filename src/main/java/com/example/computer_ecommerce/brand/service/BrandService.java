package com.example.computer_ecommerce.brand.service;

import com.example.computer_ecommerce.brand.dto.BrandRequest;
import com.example.computer_ecommerce.brand.dto.BrandResponse;
import com.example.computer_ecommerce.brand.entity.Brand;
import com.example.computer_ecommerce.brand.mapper.BrandMapper;
import com.example.computer_ecommerce.brand.repository.BrandRepository;
import com.example.computer_ecommerce.category.entity.Category;
import com.example.computer_ecommerce.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class BrandService {

    private final BrandRepository brands;
    private final CategoryRepository categories;
    private final BrandMapper mapper;

    public BrandService(
            BrandRepository brands,
            CategoryRepository categories,
            BrandMapper mapper) {
        this.brands = brands;
        this.categories = categories;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<BrandResponse> findAll() {
        return brands.findAllWithCategories().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BrandResponse findById(Long id) {
        return mapper.toResponse(getBrandWithCategories(id));
    }

    public BrandResponse create(BrandRequest request) {
        String name = request.name().trim();
        if (brands.existsByName(name)) {
            throw new IllegalArgumentException("Brand with name '" + name + "' already exists");
        }

        Brand brand = mapper.toEntity(request);
        if (request.categoryIds() != null && !request.categoryIds().isEmpty()) {
            List<Category> categoryList = categories.findAllById(request.categoryIds());
            for (Category category : categoryList) {
                category.addBrand(brand);
            }
        }

        return mapper.toResponse(brands.save(brand));
    }

    public BrandResponse update(Long id, BrandRequest request) {
        Brand brand = getBrandWithCategories(id);
        String name = request.name().trim();
        if (brands.existsByNameAndIdNot(name, id)) {
            throw new IllegalArgumentException("Brand with name '" + name + "' already exists");
        }

        mapper.updateEntity(brand, request);

        if (request.categoryIds() != null) {
            // clear existing category associations
            for (Category oldCat : new HashSet<>(brand.getCategories())) {
                oldCat.removeBrand(brand);
            }
            if (!request.categoryIds().isEmpty()) {
                List<Category> newCats = categories.findAllById(request.categoryIds());
                for (Category newCat : newCats) {
                    newCat.addBrand(brand);
                }
            }
        }

        return mapper.toResponse(brand);
    }

    public void delete(Long id) {
        Brand brand = getBrand(id);
        // remove associations in categories
        for (Category category : new HashSet<>(brand.getCategories())) {
            category.removeBrand(brand);
        }
        brands.delete(brand);
    }

    @Transactional(readOnly = true)
    public Brand getBrand(Long id) {
        return brands.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + id));
    }

    @Transactional(readOnly = true)
    public Brand getBrandWithCategories(Long id) {
        return brands.findByIdWithCategories(id)
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + id));
    }
}
