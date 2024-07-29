package com.example.springbootreactlol.service;

import com.example.springbootreactlol.entity.League;
import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.repository.LeagueRepository;
import com.example.springbootreactlol.repository.GameDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeagueGameService {

    private final LeagueRepository leagueRepository;

    private final GameDataRepository gameDataRepository;

    public LeagueGameService(GameDataRepository gameDataRepository, LeagueRepository leagueRepository) {
        this.gameDataRepository = gameDataRepository;
        this.leagueRepository = leagueRepository;
    }

    @Transactional
    public League saveLeagueWithInitialGameData(League league, List<List<String>> teamData) {
        // 리그 저장
        League savedLeague = leagueRepository.save(league);
        String matchCode = savedLeague.getLeagueMatchCode();


        return savedLeague;
    }

    private GameData createInitialGameData(String nickname, String teamColor, String matchCode) {
        GameData gameData = new GameData();
        gameData.setNickname(nickname);
        gameData.setTeamColor(teamColor);
        gameData.setMatchCode(matchCode);
        return gameData;
    }

    @Transactional
    public GameData updateGameData(String nickname, String matchCode, GameData updatedData) {
        GameData existingData = gameDataRepository.findByNicknameAndMatchCode(nickname, matchCode);
        if (existingData == null) {
            throw new RuntimeException("Game data not found");
        }

        // Update only non-null fields
        if (updatedData.getAssists() != null) existingData.setAssists(updatedData.getAssists());
        if (updatedData.getChampion() != null) existingData.setChampion(updatedData.getChampion());
        if (updatedData.getDate() != null) existingData.setDate(updatedData.getDate());
        if (updatedData.getDeaths() != null) existingData.setDeaths(updatedData.getDeaths());
        if (updatedData.getKills() != null) existingData.setKills(updatedData.getKills());
        if (updatedData.getPosition() != null) existingData.setPosition(updatedData.getPosition());
        if (updatedData.getSummonerName() != null) existingData.setSummonerName(updatedData.getSummonerName());
        if (updatedData.getWinning() != null) existingData.setWinning(updatedData.getWinning());

        return gameDataRepository.save(existingData);
    }

    public List<League> getAllLeagues() {
        return leagueRepository.findAll();
    }

    public List<GameData> getGameDataByMatchCode(String matchCode) {
        return gameDataRepository.findByMatchCode(matchCode);
    }

    public List<GameData> getGameDataByTeam(String teamColor, String matchCode) {
        return gameDataRepository.findByTeamColorAndMatchCode(teamColor, matchCode);
    }
}