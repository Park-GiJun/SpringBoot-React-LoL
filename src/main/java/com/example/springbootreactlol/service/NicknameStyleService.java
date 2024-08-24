package com.example.springbootreactlol.service;


import com.example.springbootreactlol.entity.NicknameStyle;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.entity.UserNicknameDecoration;
import com.example.springbootreactlol.repository.NicknameStyleRepository;
import com.example.springbootreactlol.repository.UserNicknameDecorationRepository;
import com.example.springbootreactlol.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
public class NicknameStyleService {

    private final NicknameStyleRepository nicknameStyleRepository;
    private final UserNicknameDecorationRepository userNicknameDecorationRepository;
    private final UserRepository userRepository;

    public NicknameStyleService(NicknameStyleRepository nicknameStyleRepository, UserNicknameDecorationRepository userNicknameDecorationRepository, UserRepository userRepository) {
        this.nicknameStyleRepository = nicknameStyleRepository;
        this.userNicknameDecorationRepository = userNicknameDecorationRepository;
        this.userRepository = userRepository;
    }

    public List<NicknameStyle> getAllNicknameStyles() {
        return nicknameStyleRepository.findAll();
    }

    @Transactional
    public boolean purchaseStyles(String nickname, List<Long> styleIds) {
        try {
            User user = userRepository.findByUsername2(nickname);

            int totalCost = 0;
            List<NicknameStyle> stylesToPurchase = new ArrayList<>();

            for (Long styleId : styleIds) {
                NicknameStyle nicknameStyle = nicknameStyleRepository.findById(styleId)
                        .orElseThrow(() -> new RuntimeException("Style not found with id: " + styleId));
                totalCost += nicknameStyle.getPrice();
                stylesToPurchase.add(nicknameStyle);
            }

            if (user.getPoint() < totalCost) {
                throw new RuntimeException("Insufficient points to purchase styles");
            }

            for (NicknameStyle style : stylesToPurchase) {
                // 기존 데코레이션의 use_flag를 false로 설정
                userNicknameDecorationRepository.updateUseFlagForExistingDecorations(nickname, style.getType());

                // 새 데코레이션 생성 및 저장
                UserNicknameDecoration newDecoration = new UserNicknameDecoration();
                newDecoration.setNickname(nickname);
                newDecoration.setType(style.getType());
                newDecoration.setStyle(style);
                newDecoration.setUseFlag(true);

                userNicknameDecorationRepository.save(newDecoration);
            }

            // 포인트 차감
            user.setPoint(user.getPoint() - totalCost);
            userRepository.save(user);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
