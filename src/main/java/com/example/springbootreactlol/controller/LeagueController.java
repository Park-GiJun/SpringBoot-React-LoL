package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.projection.LeagueStatusProjection;
import com.example.springbootreactlol.service.LeagueService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "League", description = "League management APIs")
public class LeagueController {

    private final LeagueService leagueService;

    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @GetMapping("/public/leagueList")
    public ResponseEntity<List<LeagueStatusProjection>> getLeagueList() {
        return ResponseEntity.ok(leagueService.getLeagueStatusList());
    }

}
