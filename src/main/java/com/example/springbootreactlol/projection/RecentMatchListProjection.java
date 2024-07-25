package com.example.springbootreactlol.projection;

import java.time.Instant;

public interface RecentMatchListProjection {
    String getPosition();
    String getChampion();
    Integer getKills();
    Integer getAssists();
    Integer getDeaths();
    Instant getDate();
    String getMatchCode();
    String getNickname();
    String getTeamColor();
    String getChampionEnglish();
    Integer getWinning();
}
