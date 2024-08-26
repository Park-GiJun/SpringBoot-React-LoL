package com.example.springbootreactlol.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "test_game_data")
@Getter
@Setter
public class TestGameData {

    @Id
    private Long id;

    private String name;
    private String skin;
    private String team;
    private String individualPosition;
    private String teamPosition;
    private String win;

    private Integer assists;
    private Integer championsKilled;
    private Integer doubleKills;
    private Integer tripleKills;
    private Integer quadraKills;
    private Integer numDeaths;
    private Integer goldEarned;
    private Integer goldSpent;
    private Integer level;
    private Integer minionsKilled;
    private Integer neutralMinionsKilled;
    private Integer totalDamageDealtToChampions;
    private Integer totalDamageTaken;
    private Integer turretTakedowns;
    private Integer dragonKills;
    private Integer riftHeraldKills;
    private Integer visionScore;
    private Integer wardKilled;
    private Integer wardPlaced;
    private Integer wardPlacedDetector;

    private Integer item0;
    private Integer item1;
    private Integer item2;
    private Integer item3;
    private Integer item4;
    private Integer item5;
    private Integer item6;
}
