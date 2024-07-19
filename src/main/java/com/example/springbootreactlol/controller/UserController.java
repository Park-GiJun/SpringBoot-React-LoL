package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.data.AuthResponse;
import com.example.springbootreactlol.data.UserRole;
import com.example.springbootreactlol.dto.LoginRequest;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.security.JwtUtil;
import com.example.springbootreactlol.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        final User user = userService.findByUsername(loginRequest.getUsername());
        final String jwt = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PutMapping("/{username}/role")
    public ResponseEntity<User> changeUserRole(@PathVariable String username, @RequestBody UserRole newRole) {
        return ResponseEntity.ok(userService.changeUserRole(username, newRole));
    }

}