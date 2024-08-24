package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.dto.UserNicknameDecorationDTO;
import com.example.springbootreactlol.entity.UserNicknameDecoration;
import com.example.springbootreactlol.service.UserNicknameDecorationService;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Log4j2
public class UserNicknameDecorationController {

    private final UserNicknameDecorationService userNicknameDecorationService;


    public UserNicknameDecorationController(UserNicknameDecorationService userNicknameDecorationService) {
        this.userNicknameDecorationService = userNicknameDecorationService;
    }

    @GetMapping("/public/nickname-decoration/{nickname}")
    public ResponseEntity<List<UserNicknameDecorationDTO>> getNicknameDecorations(@PathVariable String nickname) {
        List<UserNicknameDecoration> decorations = userNicknameDecorationService.getDecorationsByNickname(nickname);
        List<UserNicknameDecorationDTO> dtos = decorations.stream()
                .map(UserNicknameDecorationDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
