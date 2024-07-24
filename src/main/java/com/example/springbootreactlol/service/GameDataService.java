package com.example.springbootreactlol.service;

import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.projection.*;
import com.example.springbootreactlol.repository.GameDataRepository;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.Instant;
import java.util.List;

@Service
public class GameDataService {

    private final GameDataRepository gameDataRepository;

    public GameDataService(GameDataRepository gameDataRepository) {
        this.gameDataRepository = gameDataRepository;
    }

    public List<RankingProjection> getAllPlayerStats() {
        return gameDataRepository.findAllPlayerStats();
    }

    public List<StatisticsProjection> getAllStatistics() {
        return gameDataRepository.findStatistics();
    }

    public List<GameData> getRecentGame(){
        return gameDataRepository.findRecentGame();
    }

    public List<MatchDateProjection> getMatchDate(){
        return gameDataRepository.findMatchDate();
    }

    public List<GameData> getAllDayGameData(Instant date){
        return gameDataRepository.findGamesByDatePattern(date);
    }

    public List<NicknameProjection> getAllNickname(String nickname){
        return gameDataRepository.similarNicknames(nickname);
    }

    public List<WithHighWinRateProjection> getHighestWinRatePlayer(String nickname){
        return gameDataRepository.findWithHighWinRate(nickname);
    }

    public List<PositionWinRateProjection> getPositionWinRate(String nickname){
        return gameDataRepository.findPositionWinRate(nickname);
    }

    public List<ChampionStatProjection> getChampionStat(String nickname){
        return gameDataRepository.findChampionStats(nickname);
    }

    public List<GameData> getGameDataByNickname(String nickname){
        return gameDataRepository.findByNicknameOrderByDateDesc(nickname);
    }

    public List<GameData> getGameData(String matchCode){
        return gameDataRepository.findByMatchCode(matchCode);
    }

}
