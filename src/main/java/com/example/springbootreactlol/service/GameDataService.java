package com.example.springbootreactlol.service;

import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.projection.RankingProjection;
import com.example.springbootreactlol.projection.StatisticsProjection;
import com.example.springbootreactlol.repository.GameDataRepository;
import org.springframework.stereotype.Service;

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

}
