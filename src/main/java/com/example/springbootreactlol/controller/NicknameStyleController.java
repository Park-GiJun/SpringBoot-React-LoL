package com.example.springbootreactlol.controller;


import com.example.springbootreactlol.entity.NicknameStyle;
import com.example.springbootreactlol.service.NicknameStyleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NicknameStyleController {

    private final NicknameStyleService nicknameStyleService;

    public NicknameStyleController(NicknameStyleService nicknameStyleService) {
        this.nicknameStyleService = nicknameStyleService;
    }

    @GetMapping("/public/getAllStyles")
    public ResponseEntity<List<NicknameStyle>> allStyles() {
        return ResponseEntity.ok(nicknameStyleService.getAllNicknameStyles());
    }
}
