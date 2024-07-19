package com.example.springbootreactlol.service;

import com.example.springbootreactlol.data.UserRole;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(UserRole.USER);
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User changeUserRole(String username, UserRole newRole) {
        User user = findByUsername(username);
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public boolean isAdmin(User user) {
        return user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.MASTER;
    }

    public boolean isMaster(User user) {
        return user.getRole() == UserRole.MASTER;
    }
}