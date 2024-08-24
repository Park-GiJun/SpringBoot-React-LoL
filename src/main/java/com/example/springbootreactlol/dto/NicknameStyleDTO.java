package com.example.springbootreactlol.dto;

import com.example.springbootreactlol.entity.NicknameStyle;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NicknameStyleDTO {
    private Long styleId;
    private String name;
    private String type;
    private String description;
    private Integer price;
    private String style;

    // getters and setters

    public static NicknameStyleDTO fromEntity(NicknameStyle entity) {
        NicknameStyleDTO dto = new NicknameStyleDTO();
        dto.setStyleId(entity.getStyleId());
        dto.setName(entity.getName());
        dto.setType(entity.getType().toString());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setStyle(entity.getStyle());
        return dto;
    }
}
