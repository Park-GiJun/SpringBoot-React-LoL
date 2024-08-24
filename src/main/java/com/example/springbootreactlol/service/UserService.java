package com.example.springbootreactlol.service;

import com.example.springbootreactlol.data.UserRole;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.projection.BetRankProjection;
import com.example.springbootreactlol.repository.GameDataRepository;
import com.example.springbootreactlol.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GameDataRepository gameDataRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, GameDataRepository gameDataRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.gameDataRepository = gameDataRepository;
    }

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        int matchingNickNameCount = gameDataRepository.countByNickname(user.getNickName());
        int points = matchingNickNameCount * 100;
        user.setPoint(points);
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

    public Optional<User> findByUsernameInfo(String username) {
        return userRepository.findByUsername(username);
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

    public List<BetRankProjection> getBetRank() {
        return userRepository.findAllByOrderByPointDesc();
    }
}