package com.example.springbootreactlol.dto;

import com.example.springbootreactlol.entity.UserNicknameDecoration;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserNicknameDecorationDTO {
    private Long id;
    private String nickname;
    private String type;
    private Boolean useFlag;
    private NicknameStyleDTO style;

    // getters and setters

    public static UserNicknameDecorationDTO fromEntity(UserNicknameDecoration entity) {
        UserNicknameDecorationDTO dto = new UserNicknameDecorationDTO();
        dto.setId(entity.getId());
        dto.setNickname(entity.getNickname());
        dto.setType(entity.getType().toString());
        dto.setUseFlag(entity.getUseFlag());
        dto.setStyle(NicknameStyleDTO.fromEntity(entity.getStyle()));
        return dto;
    }
}