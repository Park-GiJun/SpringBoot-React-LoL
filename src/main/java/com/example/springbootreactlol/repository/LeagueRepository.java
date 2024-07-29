package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.League;
import com.example.springbootreactlol.projection.LeagueStatusProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LeagueRepository extends JpaRepository<League, Long> {

    @Query(value = """
            SELECT
                l.league_date,
                l.league_name,
                l.league_seq,
                GROUP_CONCAT(DISTINCT l.league_match_code) AS match_codes,
                (SELECT COUNT(DISTINCT nickname)
                 FROM game_data
                 WHERE match_code IN (SELECT league_match_code FROM league WHERE league_seq = l.league_seq)) AS player_count,
                (SELECT COUNT(DISTINCT match_code)
                 FROM game_data
                 WHERE match_code IN (SELECT league_match_code FROM league WHERE league_seq = l.league_seq)) AS game_count,
                IF(SUM(l.check_final) > 0, 'Yes', 'No') AS has_final
            FROM
                league l
            GROUP BY
                l.league_seq,
                l.league_date,
                l.league_name
            ORDER BY
                l.league_date DESC;
            """, nativeQuery = true)
    List<LeagueStatusProjection> getLeagueStatus();
}
