package com.example.springbootreactlol.service;

import com.example.springbootreactlol.entity.UserNicknameDecoration;
import com.example.springbootreactlol.repository.UserNicknameDecorationRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Log4j2
public class UserNicknameDecorationService {

    private final UserNicknameDecorationRepository userNicknameDecorationRepository;

    public UserNicknameDecorationService(UserNicknameDecorationRepository userNicknameDecorationRepository) {
        this.userNicknameDecorationRepository = userNicknameDecorationRepository;
    }

    public List<UserNicknameDecoration> getDecorationsByNickname(String nickname) {
        log.info("Fetching decorations for nickname: {}", nickname);
        log.info("Number of decorations: {}", userNicknameDecorationRepository.findAllByNickname(nickname));
        return userNicknameDecorationRepository.findAllByNickname(nickname);
    }
}
