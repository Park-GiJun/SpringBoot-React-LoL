package com.example.springbootreactlol.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateDecorateDTO {
    private List<DecorationUpdate> decorations;
}
