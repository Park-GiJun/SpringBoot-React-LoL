package com.example.springbootreactlol.service;

import com.example.springbootreactlol.dto.DecorationUpdate;
import com.example.springbootreactlol.dto.UserNicknameDecorationDTO;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.entity.UserNicknameDecoration;
import com.example.springbootreactlol.repository.UserNicknameDecorationRepository;
import com.example.springbootreactlol.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Log4j2
public class UserNicknameDecorationService {

    private final UserNicknameDecorationRepository userNicknameDecorationRepository;
    private final UserRepository userRepository;

    public UserNicknameDecorationService(UserNicknameDecorationRepository userNicknameDecorationRepository, UserRepository userRepository) {
        this.userNicknameDecorationRepository = userNicknameDecorationRepository;
        this.userRepository = userRepository;
    }

    public List<UserNicknameDecoration> getDecorationsByNickname(String nickname) {
        log.info("Fetching decorations for nickname: {}", nickname);
        log.info("Number of decorations: {}", userNicknameDecorationRepository.findAllByNickname(nickname));
        return userNicknameDecorationRepository.findAllByNickname(nickname);
    }

    public List<UserNicknameDecorationDTO> getAllDeco(String nickname) {
        List<UserNicknameDecoration> list = userNicknameDecorationRepository.findByNickname(nickname);
        List<UserNicknameDecorationDTO> dtos = new ArrayList<>();
        for (UserNicknameDecoration userNicknameDecoration : list) {
            UserNicknameDecorationDTO userNicknameDecorationDTO = UserNicknameDecorationDTO.fromEntity(userNicknameDecoration);
            dtos.add(userNicknameDecorationDTO);
        }
        return dtos;
    }

    @Transactional
    public void updateDecorations(String username, List<DecorationUpdate> updates) {

        // 업데이트할 장식들의 ID 목록
        List<Long> decorationIds = updates.stream()
                .map(DecorationUpdate::getId)
                .collect(Collectors.toList());

        // 한 번의 쿼리로 모든 관련 UserNicknameDecoration을 가져옴
        List<UserNicknameDecoration> userDecorations = userNicknameDecorationRepository.findByNicknameAndIdIn(username, decorationIds);

        // 업데이트 정보를 Map으로 변환하여 빠른 접근 가능하게 함
        Map<Long, Boolean> updateMap = updates.stream()
                .collect(Collectors.toMap(DecorationUpdate::getId, DecorationUpdate::isUseFlag));

        // 각 UserNicknameDecoration의 useFlag를 업데이트
        for (UserNicknameDecoration userDecoration : userDecorations) {
            userDecoration.setUseFlag(updateMap.get(userDecoration.getId()));
        }

        // 변경된 UserNicknameDecoration들을 한 번에 저장
        userNicknameDecorationRepository.saveAll(userDecorations);
    }
}
