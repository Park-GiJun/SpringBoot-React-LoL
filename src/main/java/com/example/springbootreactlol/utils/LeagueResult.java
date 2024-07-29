package com.example.springbootreactlol.utils;

import com.example.springbootreactlol.data.TeamStats;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.*;

public record LeagueResult(Map<String, TeamStats> teamStats) {

    @JsonIgnore
    public String getResultsAsString() {
        StringBuilder sb = new StringBuilder("League Results:%n%n");
        List<Map.Entry<String, TeamStats>> sortedEntries = teamStats.entrySet().stream()
                .sorted(Map.Entry.<String, TeamStats>comparingByValue().reversed())
                .toList();

        for (Map.Entry<String, TeamStats> entry : sortedEntries) {
            String teamName = entry.getKey();
            TeamStats stats = entry.getValue();
            sb.append(String.format("Team: %s%n%s%n", teamName, stats));
        }
        return sb.toString();
    }

}