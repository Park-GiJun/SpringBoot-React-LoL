package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.dto.LoginRequest;
import com.example.springbootreactlol.dto.UserRegistrationRequest;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.projection.BetRankProjection;
import com.example.springbootreactlol.security.JwtUtil;
import com.example.springbootreactlol.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Log4j2
@RestController
@Tag(name = "User", description = "User management APIs")
public class UserController {

    private final AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;

    private final UserService userService;

    public UserController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(
            @Parameter(description = "Login credentials", required = true)
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        final User user = userService.findByUsername(loginRequest.getUsername());

        log.info("User info: {} {} {}", user.getUsername(), user.getRole(), user.getPoint());

        final String jwt = jwtUtil.generateToken(user);
        final String refreshToken = jwtUtil.generateRefreshToken(user);

        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("token", jwt);

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().body(tokenMap);
    }

    @Operation(summary = "Register new user", description = "Register a new user in the system")
    @ApiResponse(responseCode = "200", description = "User successfully registered",
            content = @Content(schema = @Schema(implementation = User.class)))
    @PostMapping("/api/auth/register")
    public ResponseEntity<User> registerUser(
            @Parameter(description = "User details for registration", required = true)
            @RequestBody @Schema(implementation = UserRegistrationRequest.class) User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

//    @PostMapping("/api/auth/refresh")
//    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
//        if (refreshToken != null) {
//            try {
//                String username = jwtUtil.extractUsername(refreshToken);
//                User user = userService.findByUsername(username);
//
//                if (user != null && jwtUtil.validateToken(refreshToken, user)) {
//                    String newToken = jwtUtil.generateToken(user);
//
//                    Map<String, String> response = new HashMap<>();
//                    response.put("token", newToken);
//
//                    return ResponseEntity.ok(response);
//                }
//            } catch (Exception e) {
//                log.error("Error while refreshing token", e);
//            }
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
//    }
//
//    @Operation(summary = "Change user role", description = "Change the role of an existing user")
//    @ApiResponse(responseCode = "200", description = "User role successfully changed",
//            content = @Content(schema = @Schema(implementation = User.class)))
//    @PutMapping("/{username}/role")
//    public ResponseEntity<User> changeUserRole(
//            @Parameter(description = "Username of the user", required = true)
//            @PathVariable String username,
//            @Parameter(description = "New role for the user", required = true)
//            @RequestBody @Schema(implementation = UserRoleChangeRequest.class) UserRole newRole) {
//        return ResponseEntity.ok(userService.changeUserRole(username, newRole));
//    }


    @GetMapping("/api/user/points")
    public ResponseEntity<Integer> getUserPoints(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Unauthorized access attempt to /api/auth/points");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        log.info("Fetching points for user: {}", username);
        Integer points = userService.getUserPoints(username);
        return ResponseEntity.ok(points);
    }

    @GetMapping("/api/user/info")
    public ResponseEntity<Optional<User>> getUserInfo(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Unauthorized access attempt to /api/auth/info");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        log.info("Fetching user info for user: {}", username);
        Optional<User> user = userService.findByUsernameInfo(username);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().body("Logged out successfully");
    }

    @GetMapping("/public/betRank")
    public ResponseEntity<List<BetRankProjection>> betRank(){
        return ResponseEntity.ok(userService.getBetRank());
    }



}