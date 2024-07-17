package com.example.springbootreactlol.projection;

public interface StatisticsProjection {
    String getNickname();
    String getMostChampion();
    Long getPlayedGames();
    Double getWinningPercentage();
    Double getKda();
    String getMostPosition();
}
