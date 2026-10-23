package com.example.computer_ecommerce.category.service;

import com.example.computer_ecommerce.brand.entity.Brand;
import com.example.computer_ecommerce.brand.repository.BrandRepository;
import com.example.computer_ecommerce.category.dto.CategoryRequest;
import com.example.computer_ecommerce.category.dto.CategoryResponse;
import com.example.computer_ecommerce.category.entity.Category;
import com.example.computer_ecommerce.category.mapper.CategoryMapper;
import com.example.computer_ecommerce.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categories;
    private final BrandRepository brands;
    private final CategoryMapper mapper;

    public CategoryService(
            CategoryRepository categories,
            BrandRepository brands,
            CategoryMapper mapper) {
        this.categories = categories;
        this.brands = brands;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categories.findAllWithBrands().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        return mapper.toResponse(getCategoryWithBrands(id));
    }

    public CategoryResponse create(CategoryRequest request) {
        String name = request.name().trim();
        if (categories.existsByName(name)) {
            throw new IllegalArgumentException("Category with name '" + name + "' already exists");
        }

        Category category = mapper.toEntity(request);
        if (request.brandIds() != null && !request.brandIds().isEmpty()) {
            List<Brand> brandList = brands.findAllById(request.brandIds());
            for (Brand brand : brandList) {
                category.addBrand(brand);
            }
        }

        return mapper.toResponse(categories.save(category));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getCategoryWithBrands(id);
        String name = request.name().trim();
        if (categories.existsByNameAndIdNot(name, id)) {
            throw new IllegalArgumentException("Category with name '" + name + "' already exists");
        }

        mapper.updateEntity(category, request);

        if (request.brandIds() != null) {
            category.getBrands().clear();
            if (!request.brandIds().isEmpty()) {
                List<Brand> brandList = brands.findAllById(request.brandIds());
                for (Brand brand : brandList) {
                    category.addBrand(brand);
                }
            }
        }

        return mapper.toResponse(category);
    }

    public void delete(Long id) {
        Category category = getCategory(id);
        categories.delete(category);
    }

    public CategoryResponse addBrand(Long categoryId, Long brandId) {
        Category category = getCategoryWithBrands(categoryId);
        Brand brand = brands.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + brandId));

        category.addBrand(brand);
        return mapper.toResponse(category);
    }

    public CategoryResponse removeBrand(Long categoryId, Long brandId) {
        Category category = getCategoryWithBrands(categoryId);
        Brand brand = brands.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + brandId));

        category.removeBrand(brand);
        return mapper.toResponse(category);
    }

    @Transactional(readOnly = true)
    public Category getCategory(Long id) {
        return categories.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
    }

    @Transactional(readOnly = true)
    public Category getCategoryWithBrands(Long id) {
        return categories.findByIdWithBrands(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
    }
}
