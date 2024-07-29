package com.example.springbootreactlol.data;

import com.example.springbootreactlol.entity.GameData;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.util.*;

@JsonSerialize
@JsonDeserialize
@Data
public class TeamStats implements Comparable<TeamStats> {
    private int wins = 0;
    private int losses = 0;
    private int totalKills = 0;
    private int totalDeaths = 0;
    private int totalAssists = 0;
    private int gamesPlayed = 0;
    private final Map<String, PlayerStats> playerStats = new HashMap<>();

    private static final Map<String, Integer> POSITION_ORDER;

    static {
        POSITION_ORDER = new LinkedHashMap<>();
        POSITION_ORDER.put("Top", 0);
        POSITION_ORDER.put("Jungle", 1);
        POSITION_ORDER.put("Mid", 2);
        POSITION_ORDER.put("ADC", 3);
        POSITION_ORDER.put("Support", 4);
    }

    public void updateStats(List<GameData> teamData) {
        for (GameData player : teamData) {
            if (player.getWinning() == 1) wins++;
            else losses++;

            totalKills += player.getKills();
            totalDeaths += player.getDeaths();
            totalAssists += player.getAssists();
            gamesPlayed++;

            PlayerStats stats = playerStats.computeIfAbsent(player.getNickname(), k -> new PlayerStats(player.getPosition()));
            stats.update(player);
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Wins: %d, Losses: %d, KDA: %d/%d/%d, Games: %d%n",
                wins, losses, totalKills, totalDeaths, totalAssists, gamesPlayed));
        sb.append("Players:\n");

        playerStats.entrySet().stream()
                .sorted(Comparator.comparingInt(e -> POSITION_ORDER.getOrDefault(e.getValue().getPosition(), Integer.MAX_VALUE)))
                .forEach(entry -> sb.append(String.format("  %s: %s%n", entry.getKey(), entry.getValue())));

        return sb.toString();
    }

    @Override
    public int compareTo(TeamStats other) {
        return Integer.compare(this.wins, other.wins);
    }
}
