package com.example.springbootreactlol.service;

import com.example.springbootreactlol.data.BetDTO;
import com.example.springbootreactlol.entity.Bet;
import com.example.springbootreactlol.entity.League;
import com.example.springbootreactlol.entity.User;
import com.example.springbootreactlol.projection.BetResponseProjection;
import com.example.springbootreactlol.projection.LeagueTeamMemberProjection;
import com.example.springbootreactlol.repository.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@Service
public class BetService {

    private final BetRepository betRepository;
    private final TeamRepository teamRepository;
    private final LeagueRepository leagueRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final double MIN_ODDS = 1.01;
    private static final double MAX_ODDS = 10.0;
    private static final double DEFAULT_ODDS = 2.0;

    public BetService(BetRepository betRepository, TeamRepository teamRepository, LeagueRepository leagueRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.betRepository = betRepository;
        this.teamRepository = teamRepository;
        this.leagueRepository = leagueRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
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
        calculateAndBroadcastOdds(String.valueOf(betDTO.getSelectedLeagueId()));
        return betRepository.save(bet);
    }

    public List<BetResponseProjection> findBetsByLeagueId(String leagueId) {
        log.info("findBetsByLeagueId called with leagueId: {}", leagueId);
        return betRepository.findByLeagueIds(leagueRepository.findIdByLeagueSeq(String.valueOf(leagueId)));
    }

    public void calculateAndBroadcastOdds(String leagueId) {
        Map<Long, OddsAndPoints> oddsAndPoints = calculateOddsAndPoints(leagueId);
        messagingTemplate.convertAndSend("/topic/odds/" + leagueId, oddsAndPoints);
    }


    public Map<Long, OddsAndPoints> calculateOddsAndPoints(String leagueId) {
        List<Bet> bets = betRepository.findLatestBetsByLeagueIds(leagueId);
        Map<Long, Integer> totalBetsByTeam = new HashMap<>();
        final int[] totalBetAmount = {0};

        for (Bet bet : bets) {
            totalBetsByTeam.merge(bet.getTeam().getId(), bet.getBetAmount(), Integer::sum);
            totalBetAmount[0] += bet.getBetAmount();
        }

        return totalBetsByTeam.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> new OddsAndPoints(
                                calculateTeamOdds(entry.getValue(), totalBetAmount[0]),
                                entry.getValue()
                        )
                ));
    }

    private double calculateTeamOdds(int teamBetAmount, int totalBetAmount) {
        if (totalBetAmount == 0 || teamBetAmount == 0) {
            return DEFAULT_ODDS;
        }
        double rawOdds = (double) totalBetAmount / teamBetAmount;
        return Math.round(Math.clamp(rawOdds, MIN_ODDS, MAX_ODDS) * 100.0) / 100.0;
    }

    public record OddsAndPoints(double odds, int points) {
    }

    private int calculateWonPoints(int betAmount, double odds) {
        return (int) Math.floor(betAmount * odds);
    }

    @Transactional
    public void processBettingResults(String leagueSeq, Long winningTeamId) {
        // 1. 해당 리그의 모든 베팅 정보 조회
        List<Bet> bets = betRepository.findByLeague_LeagueSeqAndTeam_Id(leagueSeq, winningTeamId);

        // 2. 팀별 총 베팅 금액 계산
        Map<Long, Integer> totalBetsByTeam = bets.stream()
                .collect(Collectors.groupingBy(bet -> bet.getTeam().getId(),
                        Collectors.summingInt(Bet::getBetAmount)));

        int totalBetAmount = totalBetsByTeam.values().stream().mapToInt(Integer::intValue).sum();

        // 3. 배당률 계산
        Map<Long, Double> odds = totalBetsByTeam.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> calculateTeamOdds(entry.getValue(), totalBetAmount)
                ));

        // 4. 승리 팀에 베팅한 사용자들의 포인트 업데이트
        for (Bet bet : bets) {
            User user = userRepository.findByUsername(bet.getUserName())
                    .orElseThrow(() -> new RuntimeException("User not found: " + bet.getUserName()));

            double betOdds = odds.get(bet.getTeam().getId());
            int wonPoints = calculateWonPoints(bet.getBetAmount(), betOdds);

            user.setPoint(user.getPoint() + wonPoints);
            userRepository.save(user);
        }

        int updatedCount = leagueRepository.updateBetDeadLine(leagueSeq);
        if (updatedCount > 0) {
            log.info("Updated bet deadline for league: {} to current time", leagueSeq);
        } else {
            log.warn("No league found with leagueSeq: {}. Bet deadline not updated.", leagueSeq);
        }

        log.info("Betting results processed and deadline updated for league: {}", leagueSeq);
    }



}
