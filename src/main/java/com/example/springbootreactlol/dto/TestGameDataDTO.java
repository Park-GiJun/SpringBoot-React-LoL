package com.example.springbootreactlol.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class TestGameDataDTO {
    private List<ParticipantDTO> participants;
}