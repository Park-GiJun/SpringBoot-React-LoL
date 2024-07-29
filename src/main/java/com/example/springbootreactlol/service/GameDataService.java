package com.example.springbootreactlol.service;

import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.projection.*;
import com.example.springbootreactlol.repository.GameDataRepository;
import com.example.springbootreactlol.utils.LeagueDataProcessor;
import com.example.springbootreactlol.utils.LeagueResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@Log4j2
public class GameDataService {

    private final GameDataRepository gameDataRepository;
    private final LeagueDataProcessor leagueDataProcessor;

    public GameDataService(GameDataRepository gameDataRepository, LeagueDataProcessor leagueDataProcessor) {
        this.gameDataRepository = gameDataRepository;
        this.leagueDataProcessor = leagueDataProcessor;
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

    public List<RecentMatchListProjection> getGameDataByNickname(String nickname){
        return gameDataRepository.findByNicknameOrderByDateDesc(nickname);
    }

    public List<GameData> getGameData(String matchCode){
        return gameDataRepository.findByMatchCode(matchCode);
    }

    public List<ChampionStatisticsProjection> getTierList(){
        return gameDataRepository.findChampionStatistics();
    }

    @SneakyThrows
    public String getListMatchCode(String matchCodes) {
        List<String> listMatchCode = List.of(matchCodes.split(","));
        List<GameData> dataList = gameDataRepository.findByMatchCodeIn(listMatchCode);

        LeagueResult result = leagueDataProcessor.processLeagueData(dataList);
        ObjectMapper objectMapper = new ObjectMapper();

        String jsonString = objectMapper.writeValueAsString(result);
        log.fatal(jsonString);
        return jsonString;
    }

}
