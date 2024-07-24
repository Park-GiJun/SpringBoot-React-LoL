package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.projection.*;
import com.example.springbootreactlol.service.GameDataService;
import com.example.springbootreactlol.service.GameService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@Tag(name = "Game Data", description = "Game Data management APIs")
public class GameDataController {


    private final GameDataService gameDataService;
    private final GameService gameService;

    public GameDataController(GameDataService gameDataService, GameService gameService) {
        this.gameDataService = gameDataService;
        this.gameService = gameService;
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

    @GetMapping("/public/matchDate")
    public ResponseEntity<List<MatchDateProjection>> publicMatchDate() {
        return ResponseEntity.ok(gameDataService.getMatchDate());
    }

    @GetMapping("/public/matchData")
    public ResponseEntity<List<GameData>> publicMatchData(@RequestParam String date) {
        try {
            Instant instant = Instant.parse(date + "T00:00:00Z");
            List<GameData> gameDataList = gameDataService.getAllDayGameData(instant);
            if (gameDataList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(gameDataList);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/public/searchNickname")
    public ResponseEntity<List<NicknameProjection>> publicSearchNickname(@RequestParam("nickname") String nickname) {
        return ResponseEntity.ok(gameDataService.getAllNickname(nickname));
    }

    @PostMapping("/public/save")
    public ResponseEntity<String> saveGameData(@RequestBody List<Map<String, Object>> games) {
        try {
            log.info("Saving games into DB");
            gameService.saveGameData(games);
            return ResponseEntity.ok("Game data and bans saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving game data: " + e.getMessage());
        }
    }

    @GetMapping("/public/highWinRatePlayer")
    public ResponseEntity<List<WithHighWinRateProjection>> findHighWinRatePlayer(@RequestParam String nickname) {
        return ResponseEntity.ok(gameDataService.getHighestWinRatePlayer(nickname));
    }

    @GetMapping("/public/positionWinRate")
    public ResponseEntity<List<PositionWinRateProjection>> findPositionWinRate(@RequestParam String nickname){
        return ResponseEntity.ok(gameDataService.getPositionWinRate(nickname));
    }

    @GetMapping("/public/championStat")
    public ResponseEntity<List<ChampionStatProjection>> findChampionStat(@RequestParam String nickname){
        return ResponseEntity.ok(gameDataService.getChampionStat(nickname));
    }
}
