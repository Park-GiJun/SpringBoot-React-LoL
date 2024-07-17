package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.projection.RankingProjection;
import com.example.springbootreactlol.projection.StatisticsProjection;
import com.example.springbootreactlol.service.GameDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@RestController
public class GameDataController {


    private final GameDataService gameDataService;

    public GameDataController(GameDataService gameDataService) {
        this.gameDataService = gameDataService;
    }

    @GetMapping("/public/test")
    public ResponseEntity<String> publicTest() {
        return ResponseEntity.ok(new Date().toString());
    }

    @GetMapping("/public/statistics")
    public ResponseEntity<List<StatisticsProjection>> publicRanking() {
        return ResponseEntity.ok(gameDataService.getAllStatistics());
    }

    @GetMapping("/public/ranking")
    public ResponseEntity<List<RankingProjection>> publicStatistics() {
        return ResponseEntity.ok(gameDataService.getAllPlayerStats());
    }

    @GetMapping("/public/recent-games")
    public ResponseEntity<List<GameData>> publicRecentGames() {
        return ResponseEntity.ok(gameDataService.getRecentGame());
    }
}
