package com.solokart.service;

import org.springframework.web.multipart.MultipartFile;

import com.solokart.io.CategoryRequest;
import com.solokart.io.CategoryResponse;

import java.io.IOException;
import java.util.List;

public interface CategoryService {

    CategoryResponse add(CategoryRequest request, MultipartFile file) throws IOException;

    List<CategoryResponse> read();

    void delete(String categoryId);
}
