package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.service.LeagueService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LeagueController {

    private final LeagueService leagueService;

    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }
}
