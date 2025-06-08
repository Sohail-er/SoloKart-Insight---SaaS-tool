package com.solokart.service;

import org.springframework.web.multipart.MultipartFile;

import com.solokart.io.ItemRequest;
import com.solokart.io.ItemResponse;

import java.io.IOException;
import java.util.List;

public interface ItemService {

    ItemResponse add(ItemRequest request, MultipartFile file) throws IOException;

    List<ItemResponse> fetchItems();

    void deleteItem(String itemId);
}
