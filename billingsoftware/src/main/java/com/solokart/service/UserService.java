package com.solokart.service;

import java.util.List;

import com.solokart.io.UserRequest;
import com.solokart.io.UserResponse;

public interface UserService {

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    List<UserResponse> readUsers();

    void deleteUser(String id);

    String getUserName(String email);
}
