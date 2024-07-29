package com.example.springbootreactlol.data;

import com.example.springbootreactlol.entity.GameData;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

@JsonSerialize
@JsonDeserialize
@Data
public class PlayerStats {
    private final String position;
    private int kills = 0;
    private int deaths = 0;
    private int assists = 0;
    private int gamesPlayed = 0;

    public PlayerStats(String position) {
        this.position = position;
    }

    public void update(GameData data) {
        if (data == null) throw new IllegalArgumentException("GameData cannot be null");
        kills += data.getKills();
        deaths += data.getDeaths();
        assists += data.getAssists();
        gamesPlayed++;
    }

    @Override
    public String toString() {
        return String.format("%s: KDA: %d/%d/%d, Games: %d", position, kills, deaths, assists, gamesPlayed);
    }
}
