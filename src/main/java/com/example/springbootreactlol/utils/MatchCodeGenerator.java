package com.example.springbootreactlol.utils;

import java.util.UUID;

public class MatchCodeGenerator {

    public static String generateMatchCodeWithUUID() {
        return UUID.randomUUID().toString();
    }
}