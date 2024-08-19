package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.projection.LeagueStatusProjection;
import com.example.springbootreactlol.projection.LeaguesProjection;
import com.example.springbootreactlol.projection.TeamMemberProjection;
import com.example.springbootreactlol.service.LeagueService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "League", description = "League management APIs")
@Log4j2
public class LeagueController {

    private final LeagueService leagueService;

    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @GetMapping("/public/leagueList")
    public ResponseEntity<List<LeagueStatusProjection>> getLeagueList() {
        return ResponseEntity.ok(leagueService.getLeagueStatusList());
    }

    @GetMapping("/public/leagues")
    public ResponseEntity<List<LeaguesProjection>> getLeaguesByRegion() {
        return ResponseEntity.ok(leagueService.getLeaguesList());
    }

    @GetMapping("/public/selectedLeague/{leagueId}")
    public ResponseEntity<List<TeamMemberProjection>> getSelectedLeagueDetail(@PathVariable Long leagueId) {
        log.fatal(leagueService.getSelectedLeagueDetail(leagueId));
        return ResponseEntity.ok(leagueService.getSelectedLeagueDetail(leagueId));
    }

}
