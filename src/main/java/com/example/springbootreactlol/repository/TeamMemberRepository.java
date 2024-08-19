package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.TeamMember;
import com.example.springbootreactlol.projection.TeamMemberProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    @Query(value = """
            SELECT
                tm.id,
                tm.player_name,
                tm.position,
                t.id AS team_id
            FROM
                team_members tm
                    JOIN
                teams t ON tm.team_id = t.id
                    JOIN
                league l ON t.league_id = l.id
            WHERE
                l.id = :leagueId
            ORDER BY
                t.id,
                CASE tm.position
                    WHEN 'TOP' THEN 1
                    WHEN 'JUNGLE' THEN 2
                    WHEN 'MID' THEN 3
                    WHEN 'ADC' THEN 4
                    WHEN 'SUPPORT' THEN 5
                    ELSE 6
                    END
            """, nativeQuery = true)
    List<TeamMemberProjection> findTeamMembersByLeagueIdOrderedByTeamAndPosition(@Param("leagueId") Long leagueId);
}
