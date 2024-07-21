package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.projection.ChampionNameProjection;
import com.example.springbootreactlol.service.ChampionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Log4j2
@RestController
@Tag(name = "Champion", description = "Champion management APIs")
public class ChampionController {

    private final ChampionService championService;

    public ChampionController(ChampionService championService) {
        this.championService = championService;
    }


    @GetMapping("/public/searchChampionName")
    public ResponseEntity<List<ChampionNameProjection>> publicSearchChampionName(@RequestParam("champion") String champion) {
        log.info("Received request for champion: {}", champion);
        try {
            List<ChampionNameProjection> result = championService.getAllChampions(champion);
            log.info("Found {} champions", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error searching for champion: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
