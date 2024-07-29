package com.example.springbootreactlol.utils;

import com.example.springbootreactlol.data.TeamStats;
import com.example.springbootreactlol.entity.GameData;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class LeagueDataProcessor {
    public LeagueResult processLeagueData(List<GameData> gameDataList) {
        Map<String, TeamStats> teamStatsMap = new HashMap<>();
        Map<String, Set<String>> teamPlayers = new HashMap<>();

        Map<String, List<GameData>> matchDataMap = gameDataList.stream()
                .collect(Collectors.groupingBy(GameData::getMatchCode));

        for (List<GameData> matchData : matchDataMap.values()) {
            processMatch(matchData, teamStatsMap, teamPlayers);
        }

        return new LeagueResult(teamStatsMap);
    }

    private void processMatch(List<GameData> matchData, Map<String, TeamStats> teamStatsMap, Map<String, Set<String>> teamPlayers) {
        Set<String> teamColors = matchData.stream().map(GameData::getTeamColor).collect(Collectors.toSet());

        for (String teamColor : teamColors) {
            List<GameData> teamData = matchData.stream()
                    .filter(data -> data.getTeamColor().equals(teamColor))
                    .toList();

            String teamIdentifier = teamData.getFirst().getNickname();

            String teamName = matchTeamOrCreateNew(teamIdentifier, teamPlayers);

            TeamStats stats = teamStatsMap.computeIfAbsent(teamName, k -> new TeamStats());
            stats.updateStats(teamData);

            Set<String> players = teamPlayers.computeIfAbsent(teamName, k -> new HashSet<>());
            players.addAll(teamData.stream().map(GameData::getNickname).collect(Collectors.toSet()));
        }
    }

    private String matchTeamOrCreateNew(String teamIdentifier, Map<String, Set<String>> teamPlayers) {
        for (Map.Entry<String, Set<String>> entry : teamPlayers.entrySet()) {
            if (entry.getValue().contains(teamIdentifier)) {
                return entry.getKey();
            }
        }
        return "Team " + (teamPlayers.size() + 1);
    }
}