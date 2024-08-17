package com.example.springbootreactlol.service;

import com.example.springbootreactlol.data.BetDTO;
import com.example.springbootreactlol.entity.Bet;
import com.example.springbootreactlol.projection.BetResponseProjection;
import com.example.springbootreactlol.projection.LeagueTeamMemberProjection;
import com.example.springbootreactlol.repository.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Log4j2
@Service
public class BetService {

    private final BetRepository betRepository;
    private final TeamRepository teamRepository;
    private final LeagueRepository leagueRepository;
    private final UserRepository userRepository;

    public BetService(BetRepository betRepository, TeamRepository teamRepository, LeagueRepository leagueRepository, UserRepository userRepository) {
        this.betRepository = betRepository;
        this.teamRepository = teamRepository;
        this.leagueRepository = leagueRepository;
        this.userRepository = userRepository;
    }

    public List<LeagueTeamMemberProjection> getLeagueTeamMembers() {
        return betRepository.findAllLeagueTeamMembers();
    }

    public Bet doBet(BetDTO betDTO) {
        Bet bet = new Bet();
        bet.setBetAmount(betDTO.getAmount());
        bet.setUserName(betDTO.getId());
        bet.setLeague(leagueRepository.findById(betDTO.getSelectedLeagueId()).orElse(null));
        bet.setTeam(teamRepository.findById(betDTO.getSelectedTeamId()).orElse(null));
        bet.setBetTime(new Date().toInstant());

        userRepository.reducePoint(betDTO.getAmount(), betDTO.getId());

        return betRepository.save(bet);
    }

    public List<BetResponseProjection> findBetsByLeagueId(String leagueId) {
        log.info("findBetsByLeagueId called with leagueId: {}", leagueId);
        return betRepository.findByLeagueId(leagueRepository.findIdByLeagueSeq(String.valueOf(leagueId)));
    }
}
