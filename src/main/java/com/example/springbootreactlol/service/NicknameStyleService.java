package com.example.springbootreactlol.service;


import com.example.springbootreactlol.entity.NicknameStyle;
import com.example.springbootreactlol.repository.NicknameStyleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NicknameStyleService {

    private final NicknameStyleRepository nicknameStyleRepository;

    public NicknameStyleService(NicknameStyleRepository nicknameStyleRepository) {
        this.nicknameStyleRepository = nicknameStyleRepository;
    }

    public List<NicknameStyle> getAllNicknameStyles() {
        return nicknameStyleRepository.findAll();
    }
}
