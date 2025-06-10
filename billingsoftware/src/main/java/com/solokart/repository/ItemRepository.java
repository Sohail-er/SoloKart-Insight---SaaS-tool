package com.solokart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solokart.entity.ItemEntity;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

    Optional<ItemEntity> findByItemId(String id);

    Integer countByCategoryId(Long id);

    List<ItemEntity> findByCategoryId(Long categoryId);
}
