package com.example.springbootreactlol.dto;

import com.example.springbootreactlol.data.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

public class UserRegistrationRequest {
    @Schema(description = "User's username", example = "test")
    private String username;

    @Schema(description = "User's password", example = "1234")
    private String password;

    @Schema(description = "User's nickname", example = "test")
    private String nickName;

    @Schema(description = "User's role", example = "test")
    private UserRole role;
}
