package com.solokart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solokart.entity.CategoryEntity;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    Optional<CategoryEntity> findByCategoryId(String categoryId);
}
