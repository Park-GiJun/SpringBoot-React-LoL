package com.example.springbootreactlol.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ParticipantDTO {
    @JsonProperty("ID")
    private String id;
    @JsonProperty("NAME")
    private String name;
    @JsonProperty("SKIN")
    private String skin;
    @JsonProperty("TEAM")
    private String team;
    @JsonProperty("INDIVIDUAL_POSITION")
    private String individualPosition;
    @JsonProperty("TEAM_POSITION")
    private String teamPosition;
    @JsonProperty("WIN")
    private String win;
    @JsonProperty("ASSISTS")
    private Integer assists;
    @JsonProperty("CHAMPIONS_KILLED")
    private Integer championsKilled;
    @JsonProperty("DOUBLE_KILLS")
    private Integer doubleKills;
    @JsonProperty("TRIPLE_KILLS")
    private Integer tripleKills;
    @JsonProperty("QUADRA_KILLS")
    private Integer quadraKills;
    @JsonProperty("NUM_DEATHS")
    private Integer numDeaths;
    @JsonProperty("GOLD_EARNED")
    private Integer goldEarned;
    @JsonProperty("GOLD_SPENT")
    private Integer goldSpent;
    @JsonProperty("LEVEL")
    private Integer level;
    @JsonProperty("MINIONS_KILLED")
    private Integer minionsKilled;
    @JsonProperty("NEUTRAL_MINIONS_KILLED")
    private Integer neutralMinionsKilled;
    @JsonProperty("TOTAL_DAMAGE_DEALT_TO_CHAMPIONS")
    private Integer totalDamageDealtToChampions;
    @JsonProperty("TOTAL_DAMAGE_TAKEN")
    private Integer totalDamageTaken;
    @JsonProperty("TURRET_TAKEDOWNS")
    private Integer turretTakedowns;
    @JsonProperty("DRAGON_KILLS")
    private Integer dragonKills;
    @JsonProperty("RIFT_HERALD_KILLS")
    private Integer riftHeraldKills;
    @JsonProperty("VISION_SCORE")
    private Integer visionScore;
    @JsonProperty("WARD_KILLED")
    private Integer wardKilled;
    @JsonProperty("WARD_PLACED")
    private Integer wardPlaced;
    @JsonProperty("WARD_PLACED_DETECTOR")
    private Integer wardPlacedDetector;
    @JsonProperty("ITEM0")
    private Integer item0;
    @JsonProperty("ITEM1")
    private Integer item1;
    @JsonProperty("ITEM2")
    private Integer item2;
    @JsonProperty("ITEM3")
    private Integer item3;
    @JsonProperty("ITEM4")
    private Integer item4;
    @JsonProperty("ITEM5")
    private Integer item5;
    @JsonProperty("ITEM6")
    private Integer item6;
    @JsonProperty("EXP")
    private Integer exp;
    @JsonProperty("HQ_KILLED")
    private Integer hqKilled;
    @JsonProperty("SIGHT_WARDS_BOUGHT_IN_GAME")
    private Integer sightWardsBoughtInGame;
    @JsonProperty("VISION_WARDS_BOUGHT_IN_GAME")
    private Integer visionWardsBoughtInGame;
    @JsonProperty("ASSIGNED_POSITION")
    private String assignedPosition;
}