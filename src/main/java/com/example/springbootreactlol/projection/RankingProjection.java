package com.example.springbootreactlol.projection;

public interface RankingProjection {
    String getNickname();
    String getMostChampion();
    Long getPlayedGames();
    Double getWinningPercentage();
    Double getKda();
    String getMostPosition();
}
