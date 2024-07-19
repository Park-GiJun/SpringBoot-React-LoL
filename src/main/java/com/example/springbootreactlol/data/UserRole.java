package com.example.springbootreactlol.data;

public enum UserRole {
    USER,
    ADMIN,
    MASTER;

    public String getAuthority() {
        return "ROLE_" + name();
    }
}