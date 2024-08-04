package com.example.springbootreactlol.service;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class ChatService {
    private final Set<String> connectedUsers = new HashSet<>();

    public void addUser(String username) {
        connectedUsers.add(username);
    }

    public void removeUser(String username) {
        connectedUsers.remove(username);
    }

    public Set<String> getConnectedUsers() {
        return new HashSet<>(connectedUsers);
    }
}