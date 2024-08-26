package com.example.springbootreactlol.dto;

import com.example.springbootreactlol.entity.NicknameStyle;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link com.example.springbootreactlol.entity.UserNicknameDecoration}
 */
@Value
@Getter
@Setter
public class DecorationUpdate implements Serializable {
    Long id;
    boolean useFlag;
}