package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.projection.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface GameDataRepository extends JpaRepository<GameData, Long> {
    @Query(value = "SELECT " +
            "g.nickname AS nickname, " +
            "(SELECT gd.champion " +
            " FROM game_data gd " +
            " WHERE gd.nickname = g.nickname " +
            " GROUP BY gd.champion " +
            " ORDER BY COUNT(*) DESC, gd.champion ASC " +
            " LIMIT 1) AS mostChampion, " +
            "(SELECT COUNT(*) " +
            " FROM game_data gd " +
            " WHERE gd.nickname = g.nickname) AS playedGames, " +
            "ROUND(SUM(IF(g.winning = 1, 1, 0)) / COUNT(*) * 100, 2) AS winningPercentage, " +
            "ROUND((SUM(g.kills) + SUM(g.assists)) / GREATEST(SUM(g.deaths), 1), 2) AS kda, " +
            "(SELECT gd2.position " +
            " FROM game_data gd2 " +
            " WHERE gd2.nickname = g.nickname " +
            " GROUP BY gd2.position " +
            " ORDER BY COUNT(*) DESC " +
            " LIMIT 1) AS mostPosition " +
            "FROM game_data g " +
            "GROUP BY g.nickname " +
            "ORDER BY winningPercentage DESC, playedGames DESC, kda DESC",
            nativeQuery = true)
    List<RankingProjection> findAllPlayerStats();


    @Query(value = " SELECT COUNT(g.id) / 10       AS totalGamesPlayed," +
            "                   COUNT(DISTINCT DATE(g.date)) AS totalDaysPlayed," +
            "                   SUM(g.kills)           AS totalKills," +
            "                   (SELECT gg.champion" +
            "                    FROM game_data gg" +
            "                    GROUP BY gg.champion" +
            "                    HAVING COUNT(gg.champion) >= 3" +
            "                    ORDER BY COUNT(gg.champion) DESC, SUM(gg.kills) DESC" +
            "                    LIMIT 1)              AS mostPlayedChampion," +
            "                   (SELECT gg.champion" +
            "                    FROM game_data gg" +
            "                    GROUP BY gg.champion" +
            "                    HAVING COUNT(gg.champion) >= 3" +
            "                    ORDER BY (SUM(gg.kills) / COUNT(gg.champion)) DESC" +
            "                    LIMIT 1)              AS mostKillsChampion," +
            "                   (SELECT gg.champion" +
            "                    FROM game_data gg" +
            "                    GROUP BY gg.champion" +
            "                    HAVING COUNT(gg.champion) >= 3" +
            "                    ORDER BY (SUM(gg.deaths) / COUNT(gg.champion)) DESC" +
            "                    LIMIT 1)              AS mostDeathsChampion," +
            "                   (SELECT gg.nickname" +
            "                    FROM game_data gg" +
            "                    GROUP BY gg.summoner_name" +
            "                    ORDER BY COUNT(DISTINCT gg.champion) DESC" +
            "                    LIMIT 1)              AS mostDifferentChampion," +
            "                   (SELECT gg.champion" +
            "                    FROM game_data gg" +
            "                    GROUP BY gg.champion" +
            "                    HAVING COUNT(gg.champion) >= 3" +
            "                    ORDER BY ((SUM(gg.kills) + SUM(gg.assists)) / NULLIF(SUM(gg.deaths), 0)) DESC" +
            "                    LIMIT 1)              AS bestKDAChampion" +
            "            FROM game_data g", nativeQuery = true)
    List<StatisticsProjection> findStatistics();

    @Query(value = "SELECT * FROM game_data ORDER BY id DESC LIMIT 10", nativeQuery = true)
    List<GameData> findRecentGame();

    @Query(value = "SELECT DISTINCT DATE(game_data.date) as matchDate FROM game_data GROUP BY DATE(game_data.date) ORDER BY game_data.date desc", nativeQuery = true)
    List<MatchDateProjection> findMatchDate();

    @Query("SELECT g FROM GameData g WHERE FUNCTION('DATE', g.date) = FUNCTION('DATE', :date)")
    List<GameData> findGamesByDatePattern(@Param("date") Instant date);

    @Query(value = "SELECT nickName FROM game_data WHERE nickName LIKE CONCAT('%', :nickname, '%') GROUP BY nickName", nativeQuery = true)
    List<NicknameProjection> similarNicknames(@Param("nickname") String nickname);


    @Query(value = "WITH MatchCodes AS (" +
            "    SELECT DISTINCT match_code, team_color" +
            "    FROM game_data" +
            "    WHERE nickname = :nickname " +
            ")," +
            "     TeammateWinRates AS (" +
            "         SELECT" +
            "             gm.nickname," +
            "             SUM(gm.winning) AS wins," +
            "             COUNT(DISTINCT gm.match_code) AS total_matches," +
            "             (SUM(gm.winning) * 1.0 / COUNT(DISTINCT gm.match_code)) AS win_rate" +
            "         FROM" +
            "             game_data gm" +
            "                 JOIN" +
            "             MatchCodes mc ON gm.match_code = mc.match_code AND gm.team_color = mc.team_color" +
            "         WHERE" +
            "             gm.nickname != :nickname " +
            "         GROUP BY" +
            "             gm.nickname" +
            "     )" +
            "SELECT" +
            "    nickname AS player," +
            "    ROUND(win_rate * 100, 2) AS winRate," +
            "    total_matches AS played" +
            " FROM" +
            "    TeammateWinRates" +
            " WHERE" +
            "    total_matches > 3" +
            " ORDER BY" +
            "    winRate DESC," +
            "    played DESC " +
            " LIMIT 5", nativeQuery = true)
    List<WithHighWinRateProjection> findWithHighWinRate(@Param("nickname") String nickname);


}
