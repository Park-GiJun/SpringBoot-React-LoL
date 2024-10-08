package com.example.springbootreactlol.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @Schema(description = "User's username", example = "test")
    private String username;

    @Schema(description = "User's password", example = "1234")
    private String password;
}
