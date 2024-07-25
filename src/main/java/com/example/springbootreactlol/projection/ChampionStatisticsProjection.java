package com.example.springbootreactlol.projection;

public interface ChampionStatisticsProjection {
    String getChampion();
    Double getWinRate();
    Integer getPlayed();
    Double getKda();
    String getTier();
    String getMostPlayedBy();
    Integer getPlayersCount();
    Double getBanRate();
}