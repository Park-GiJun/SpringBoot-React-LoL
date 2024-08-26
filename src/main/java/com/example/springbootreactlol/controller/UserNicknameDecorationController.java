package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.dto.UpdateDecorateDTO;
import com.example.springbootreactlol.dto.UserNicknameDecorationDTO;
import com.example.springbootreactlol.entity.UserNicknameDecoration;
import com.example.springbootreactlol.security.JwtUtil;
import com.example.springbootreactlol.service.UserNicknameDecorationService;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Log4j2
public class UserNicknameDecorationController {

    private final UserNicknameDecorationService userNicknameDecorationService;
    private final JwtUtil jwtUtil;


    public UserNicknameDecorationController(UserNicknameDecorationService userNicknameDecorationService, JwtUtil jwtUtil) {
        this.userNicknameDecorationService = userNicknameDecorationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/public/nickname-decoration/{nickname}")
    public ResponseEntity<List<UserNicknameDecorationDTO>> getNicknameDecorations(@PathVariable String nickname) {
        List<UserNicknameDecoration> decorations = userNicknameDecorationService.getDecorationsByNickname(nickname);
        List<UserNicknameDecorationDTO> dtos = decorations.stream()
                .map(UserNicknameDecorationDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/api/user/decorations")
    public ResponseEntity<List<UserNicknameDecorationDTO>> getAllDecorationsByUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, List<Long>> payload
    ) {
        String token = authHeader.substring(7);
        String nickname = jwtUtil.extractUsername(token);

        return ResponseEntity.ok(userNicknameDecorationService.getAllDeco(nickname));
    }

    @PutMapping("/api/user/update-decoration")
    public ResponseEntity<?> updateDecoration(@RequestHeader("Authorization") String authHeader, @RequestBody UpdateDecorateDTO updateDecorateDTO) {
        String username = jwtUtil.extractUsername(authHeader.substring(7));
        userNicknameDecorationService.updateDecorations(username, updateDecorateDTO.getDecorations());


        return  ResponseEntity.ok("hi");
    }
}
