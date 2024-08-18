package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.Bet;
import com.example.springbootreactlol.projection.BetResponseProjection;
import com.example.springbootreactlol.projection.LeagueTeamMemberProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BetRepository extends JpaRepository<Bet, Long> {

    @Query(value =
            """
            SELECT l.id AS leagueId, l.league_name AS leagueName, l.league_date AS leagueDate,
                   l.league_seq AS leagueSeq, l.league_match_code AS leagueMatchCode, l.check_final AS checkFinal, l.bet_dead_line AS betDeadLine,
                   l.bet_dead_line AS betDeadLine,
                   t.id AS teamId, t.team_name AS teamName,
                   tm.id AS memberId, tm.player_name AS playerName, tm.position AS position
            FROM league l
            JOIN teams t ON l.id = t.league_id
            JOIN team_members tm ON t.id = tm.team_id
            WHERE l.bet_dead_line > now()
            ORDER BY l.id
            """, nativeQuery = true)
    List<LeagueTeamMemberProjection> findAllLeagueTeamMembers();


    @Query(value = "SELECT b.bet_amount, b.bet_time, b.league_id, b.user_name, (SELECT team_name FROM teams t WHERE t.league_id = b.league_id AND t.id = b.team_id LIMIT 1 ) AS teamId FROM bets b WHERE b.league_id = :leagueId ORDER BY b.bet_time", nativeQuery = true)
    List<BetResponseProjection> findByLeagueIds(Long leagueId);

    @Query(value = """
            SELECT b.*
            FROM bets b
                     JOIN league l ON b.league_id = l.id
            WHERE l.league_seq = :leagueSeq
            """, nativeQuery = true)
    List<Bet> findLatestBetsByLeagueIds(String leagueSeq);

    List<Bet> findByLeague_LeagueSeqAndTeam_Id(String leagueSeq, Long teamId);

}


