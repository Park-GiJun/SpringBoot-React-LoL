package com.example.springbootreactlol.data;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameDataDTO {
    private String nickname;
    private String champion;
    private int kills;
    private int deaths;
    private int assists;
    private String teamColor;
    private String position;
    private int winning;
    private String date;


}