package com.example.springbootreactlol.dto;

import com.example.springbootreactlol.data.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

public class UserRoleChangeRequest {
    @Schema(description = "New role for the user", example = "ADMIN")
    private UserRole newRole;
}
