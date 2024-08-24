package com.example.springbootreactlol.controller;


import com.example.springbootreactlol.entity.NicknameStyle;
import com.example.springbootreactlol.security.JwtUtil;
import com.example.springbootreactlol.service.NicknameStyleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class NicknameStyleController {

    private final NicknameStyleService nicknameStyleService;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    public NicknameStyleController(NicknameStyleService nicknameStyleService, JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.nicknameStyleService = nicknameStyleService;
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/public/getAllStyles")
    public ResponseEntity<List<NicknameStyle>> allStyles() {
        return ResponseEntity.ok(nicknameStyleService.getAllNicknameStyles());
    }

    @PostMapping("/user/purchaseStyles")
    public ResponseEntity<?> purchaseStyles(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, List<Long>> payload
    ) {
        try {
            String token = authHeader.substring(7);
            String nickname = jwtUtil.extractUsername(token);

            if (nickname == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid token"));
            }

            List<Long> styleIds = payload.get("styleIds");
            if (styleIds == null || styleIds.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing or empty styleIds in the request body"));
            }

            boolean purchaseSuccess = nicknameStyleService.purchaseStyles(nickname, styleIds);
            if (purchaseSuccess) {
                return ResponseEntity.ok().body(Map.of("success", true, "message", "Styles purchased successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to purchase styles"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to purchase styles: " + e.getMessage()));
        }
    }
}
