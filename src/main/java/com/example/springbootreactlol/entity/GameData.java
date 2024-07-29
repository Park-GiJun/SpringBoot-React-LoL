package com.example.springbootreactlol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "game_data")
public class GameData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "assists", nullable = true)
    private Integer assists;

    @Column(name = "champion")
    private String champion;

    @Column(name = "date")
    private Instant date;

    @Column(name = "deaths", nullable = true)
    private Integer deaths;

    @Column(name = "kills", nullable = true)
    private Integer kills;

    @Column(name = "match_code")
    private String matchCode;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "position")
    private String position;

    @Column(name = "summoner_name")
    private String summonerName;

    @Column(name = "team_color")
    private String teamColor;

    @Column(name = "winning", nullable = true)
    private Integer winning;

}