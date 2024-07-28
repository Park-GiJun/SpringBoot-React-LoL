package com.example.springbootreactlol.service;

import com.example.springbootreactlol.data.UserRole;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    @Transactional
    public User findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPoint(user.getPoint() + 50);
        userRepository.save(user);

        return user;
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

    public Integer getUserPoints(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getPoint();
    }
}