package com.example.springbootreactlol.service;


import com.example.springbootreactlol.repository.LeagueRepository;
import org.springframework.stereotype.Service;

@Service
public class LeagueService {

    private final LeagueRepository leagueRepository;

    public LeagueService(LeagueRepository leagueRepository) {
        this.leagueRepository = leagueRepository;
    }
}
