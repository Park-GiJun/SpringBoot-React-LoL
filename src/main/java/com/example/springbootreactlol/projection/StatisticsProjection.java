package com.example.springbootreactlol.projection;

public interface StatisticsProjection {
    int getTotalGamesPlayed();
    int getTotalDaysPlayed();
    int getTotalKills();
    String getMostPlayedChampion();
    String getMostKillsChampion();
    String getMostDeathsChampion();
    String getMostDifferentChampion();
    String getBestKDAChampion();
}
