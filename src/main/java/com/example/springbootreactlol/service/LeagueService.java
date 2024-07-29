package com.example.springbootreactlol.service;


import com.example.springbootreactlol.entity.Ban;
import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.entity.League;
import com.example.springbootreactlol.entity.MatchCode;
import com.example.springbootreactlol.projection.LeagueStatusProjection;
import com.example.springbootreactlol.repository.LeagueRepository;
import com.example.springbootreactlol.repository.MatchCodeRepository;
import com.example.springbootreactlol.utils.MatchCodeGenerator;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LeagueService {

    private final LeagueRepository leagueRepository;
    private final MatchCodeRepository matchCodeRepository;

    public LeagueService(LeagueRepository leagueRepository, MatchCodeRepository matchCodeRepository) {
        this.leagueRepository = leagueRepository;
        this.matchCodeRepository = matchCodeRepository;
    }

    public List<LeagueStatusProjection> getLeagueStatusList() {
        return leagueRepository.getLeagueStatus();
    }

}
