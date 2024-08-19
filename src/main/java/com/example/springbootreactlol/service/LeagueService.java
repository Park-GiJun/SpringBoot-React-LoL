package com.example.springbootreactlol.service;

import com.example.springbootreactlol.dto.LeagueUploadDTO;
import com.example.springbootreactlol.entity.*;
import com.example.springbootreactlol.projection.LeagueStatusProjection;
import com.example.springbootreactlol.projection.LeaguesProjection;
import com.example.springbootreactlol.projection.TeamMemberProjection;
import com.example.springbootreactlol.repository.*;
import com.example.springbootreactlol.utils.MatchCodeGenerator;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class LeagueService {

    private final LeagueRepository leagueRepository;
    private final MatchCodeRepository matchCodeRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final LeagueMatchRelationRepository leagueMatchRelationRepository;

    public LeagueService(LeagueRepository leagueRepository,
                         MatchCodeRepository matchCodeRepository,
                         TeamRepository teamRepository, TeamMemberRepository teamMemberRepository, LeagueMatchRelationRepository leagueMatchRelationRepository) {
        this.leagueRepository = leagueRepository;
        this.matchCodeRepository = matchCodeRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.leagueMatchRelationRepository = leagueMatchRelationRepository;
    }

    public List<LeagueStatusProjection> getLeagueStatusList() {
        return leagueRepository.getLeagueStatus();
    }

    @Transactional
    public void createLeague(LeagueUploadDTO leagueUploadDTO) {
        List<League> leagueList = new ArrayList<>();
        MatchCode leagueCode = new MatchCode();
        leagueCode.setMatchCode(MatchCodeGenerator.generateMatchCodeWithUUID());
        leagueCode.setWinning(0);
        for (int i = 0; i < leagueUploadDTO.getNumberOfTeams(); i++) {
            League league = new League();
            league.setLeagueName(leagueUploadDTO.getLeagueName());
            league.setLeagueDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            league.setLeagueSeq(leagueCode.getMatchCode());
            league.setCheckFinal(false);
            league.setBetDeadLine(leagueUploadDTO.getBetDeadline().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            league = leagueRepository.save(league);

            MatchCode matchCode = new MatchCode();
            matchCode.setMatchCode(MatchCodeGenerator.generateMatchCodeWithUUID());
            matchCode.setWinning(0);
            matchCode = matchCodeRepository.save(matchCode);

            LeagueMatchRelation relation = new LeagueMatchRelation();
            relation.setLeague(league);
            relation.setMatchCode(matchCode);
            leagueMatchRelationRepository.save(relation);

            league.setLeagueMatchCode(matchCode.getMatchCode());

            league.getLeagueMatchRelations().add(relation);

            leagueList.add(league);
        }

        leagueRepository.saveAll(leagueList);

        for (LeagueUploadDTO.Team teamDTO : leagueUploadDTO.getTeams()) {
            Team team = new Team();
            team.setTeamName(teamDTO.getName());
            team.setLeague(leagueList.getFirst());

            List<TeamMember> members = new ArrayList<>();
            for (LeagueUploadDTO.Member memberDTO : teamDTO.getMembers()) {
                TeamMember teamMember = new TeamMember();
                teamMember.setPlayerName(memberDTO.getName());
                teamMember.setPosition(TeamMember.Position.valueOf(memberDTO.getPosition().toUpperCase()));
                teamMember.setTeam(team);
                members.add(teamMember);
                teamMemberRepository.save(teamMember);
            }
            team.setMembers(members);
            teamRepository.save(team);
        }
    }

    private String generateLeagueSeq() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + String.format("%03d", (int) (Math.random() * 1000));
    }

    public List<LeaguesProjection> getLeaguesList() {
        return leagueRepository.getLeagues();
    }

    public List<TeamMemberProjection> getSelectedLeagueDetail(Long leagueId) {
        return teamMemberRepository.findTeamMembersByLeagueIdOrderedByTeamAndPosition(leagueId);
    }
}