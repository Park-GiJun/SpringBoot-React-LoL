package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.NicknameStyle;
import com.example.springbootreactlol.entity.UserNicknameDecoration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserNicknameDecorationRepository extends JpaRepository<UserNicknameDecoration, Long> {

    @Query(value = "SELECT * FROM user_nickname_decoration d WHERE d.nickname = (SELECT username FROM users WHERE nick_name = :nickname LIMIT 1)", nativeQuery = true  )
    List<UserNicknameDecoration> findAllByNickname(String nickname);

    @Modifying
    @Query("UPDATE UserNicknameDecoration u SET u.useFlag = false WHERE u.nickname = :nickname AND u.type = :type AND u.useFlag = true")
    void updateUseFlagForExistingDecorations(@Param("nickname") String nickname, @Param("type") NicknameStyle.StyleType type);
}
