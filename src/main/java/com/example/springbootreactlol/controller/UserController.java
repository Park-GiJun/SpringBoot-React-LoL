package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.data.AuthResponse;
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
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @Operation(summary = "User login", description = "Authenticate a user and return a JWT token")
    @ApiResponse(responseCode = "200", description = "Successful login",
            content = @Content(schema = @Schema(implementation = AuthResponse.class)))
    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(
            @Parameter(description = "Login credentials", required = true)
            @RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        final User user = userService.findByUsername(loginRequest.getUsername());
        final String jwt = jwtUtil.generateToken(user.getUsername());

        log.info(new AuthResponse(jwt));

        return ResponseEntity.ok(new AuthResponse(jwt));
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
}