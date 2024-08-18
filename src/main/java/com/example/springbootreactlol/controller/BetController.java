package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.data.BetDTO;
import com.example.springbootreactlol.dto.LeagueUploadDTO;
import com.example.springbootreactlol.entity.Bet;
import com.example.springbootreactlol.entity.TeamMember;
import com.example.springbootreactlol.projection.BetResponseProjection;
import com.example.springbootreactlol.service.BetService;
import com.example.springbootreactlol.service.LeagueService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@Tag(name = "Bet", description = "Bet management APIs")
public class BetController {

    private final BetService betService;
    private final LeagueService createLeagueService;
    private final LeagueService leagueService;

    public BetController(BetService betService, LeagueService createLeagueService, LeagueService leagueService) {
        this.betService = betService;
        this.createLeagueService = createLeagueService;
        this.leagueService = leagueService;
    }

    @PostMapping("/api/admin/uploadLeague")
    public ResponseEntity<?> uploadLeague(@RequestBody LeagueUploadDTO leagueUploadDTO) {

        log.info("Received league: {}", leagueUploadDTO.getLeagueName());
        log.info("Bet deadline: {}", leagueUploadDTO.getBetDeadline());
        log.info("Number of teams: {}", leagueUploadDTO.getTeams().size());
        for (LeagueUploadDTO.Team team : leagueUploadDTO.getTeams()) {
            log.info("Team: {}", team.getName());
            for (LeagueUploadDTO.Member teamMember : team.getMembers()){
                log.info("Member: {} - {}", teamMember.getName(), teamMember.getPosition());
            }
        }

        leagueService.createLeague(leagueUploadDTO);

        return ResponseEntity.ok("League uploaded successfully");
    }

    @GetMapping("/api/user/betList")
    public ResponseEntity<?> betList() {
        return ResponseEntity.ok(betService.getLeagueTeamMembers());
    }

    @PostMapping("/api/user/bet")
    public ResponseEntity<?> placeBet(@RequestBody BetDTO betDTO) {
        log.info("Placed bet: {}", betDTO);
        return ResponseEntity.ok(betService.doBet(betDTO));
    }

    @GetMapping("/public/{leagueId}/bets")
    public ResponseEntity<List<BetResponseProjection>> getBetsByLeague(@PathVariable String leagueId) {
        log.info("Retrieving bets for league: {}", leagueId);
        List<BetResponseProjection> bets = betService.findBetsByLeagueId(leagueId);
        for (BetResponseProjection bet : bets) {
            log.info("Bet: {}", bet);
        }
        return ResponseEntity.ok(bets);
    }
}
