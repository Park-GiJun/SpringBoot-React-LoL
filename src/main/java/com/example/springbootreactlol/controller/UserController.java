package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.data.UserRole;
import com.example.springbootreactlol.dto.LoginRequest;
import com.example.springbootreactlol.dto.UserRegistrationRequest;
import com.example.springbootreactlol.dto.UserRoleChangeRequest;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.security.JwtUtil;
import com.example.springbootreactlol.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

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
            @RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        final User user = userService.findByUsername(loginRequest.getUsername());

        log.fatal("user info {} {} {} {} {}", user.getUsername(), user.getPoint(), user.getRole(), user.getPassword(), user.getPoint());

        final String jwt = jwtUtil.generateToken(user);

        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("token", jwt);

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

    @Operation(summary = "Change user role", description = "Change the role of an existing user")
    @ApiResponse(responseCode = "200", description = "User role successfully changed",
            content = @Content(schema = @Schema(implementation = User.class)))
    @PutMapping("/{username}/role")
    public ResponseEntity<User> changeUserRole(
            @Parameter(description = "Username of the user", required = true)
            @PathVariable String username,
            @Parameter(description = "New role for the user", required = true)
            @RequestBody @Schema(implementation = UserRoleChangeRequest.class) UserRole newRole) {
        return ResponseEntity.ok(userService.changeUserRole(username, newRole));
    }


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
}