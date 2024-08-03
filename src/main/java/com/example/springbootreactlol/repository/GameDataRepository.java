package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.Champion;
import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.projection.*;
import org.springframework.data.domain.Sort;
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
            "    played DESC ", nativeQuery = true)
    List<WithHighWinRateProjection> findWithHighWinRate(@Param("nickname") String nickname);

    @Query("select g from GameData g where g.matchCode = ?1")
    List<GameData> findByMatchCode(String matchCode);

    @Query(value = "WITH PositionStats AS ( " +
            "                SELECT position, " +
            "                       SUM(IF(winning = 1, 1, 0)) * 100.0 / COUNT(*) AS winRate, " +
            "                       COUNT(*)                                      AS played " +
            "                FROM game_data " +
            "                WHERE nickname = :nickname " +
            "                GROUP BY position " +
            "            ) " +
            "            SELECT position, " +
            "                   CONCAT(ROUND(winRate, 2), '%') AS winRate, " +
            "                   played " +
            "            FROM PositionStats " +
            "            ORDER BY winRate DESC;", nativeQuery = true)
    List<PositionWinRateProjection> findPositionWinRate(@Param("nickname") String nickname);

    @Query(nativeQuery = true, value = """
               WITH ChampionStats AS (
                           SELECT champion,
                                  position,
                                  SUM(IF(winning = 1, 1, 0)) * 100.0 / COUNT(*) AS winRate,
                                  (SUM(kills) + SUM(assists)) / SUM(deaths) AS kda,
                                  COUNT(*) AS totalGames
                           FROM game_data
                           WHERE nickname = :nickname
                           GROUP BY champion, position
                       )
                       SELECT champion,
                              position,
                              ROUND(winRate, 2) AS winRate,
                              ROUND(kda, 2) AS kda,
                              totalGames
                       FROM ChampionStats
                       ORDER BY totalGames DESC, winRate DESC
            """)
    List<ChampionStatProjection> findChampionStats(@Param("nickname") String nickname);


    @Query(value = """
SELECT * from game_data g LEFT JOIN champion c on g.champion = c.champion WHERE g.nickname = :nickname ORDER BY DATE DESC
""", nativeQuery = true)
    List<RecentMatchListProjection> findByNicknameOrderByDateDesc(String nickname);

    @Query(value = """
            SELECT
                ranked_data.champion AS champion,
                ranked_data.winRate AS winRate,
                ranked_data.played AS played,
                ranked_data.kda AS kda,
                ranked_data.tier AS tier,
                most_player.nickname AS mostPlayedBy,
                ranked_data.playersCount AS playersCount,
                ROUND(COALESCE(ban_data.banRate, 0), 2) AS banRate,
                championEnglish
            FROM (
                     SELECT
                         g.champion AS champion,
                         ROUND(SUM(CASE WHEN g.winning = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(g.id), 2) AS winRate,
                         COUNT(g.id) AS played,
                         ROUND(SUM(g.kills + g.assists) / SUM(CASE WHEN g.deaths = 0 THEN 1 ELSE g.deaths END), 2) AS kda,
                         COUNT(DISTINCT g.nickname) AS playersCount,
                         CASE
                             WHEN PERCENT_RANK() OVER (
                                 ORDER BY (
                                     ROUND(SUM(CASE WHEN g.winning = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(g.id), 2) +
                                     (COALESCE(ban_data.banRate, 0) * 1.1) +
                                     (ROUND(SUM(g.kills + g.assists) / SUM(CASE WHEN g.deaths = 0 THEN 1 ELSE g.deaths END), 2) * 0.8)
                                     ) DESC, COUNT(g.id) DESC
                                 ) <= 0.2 THEN 'Tier 1'
                             WHEN PERCENT_RANK() OVER (
                                 ORDER BY (
                                     ROUND(SUM(CASE WHEN g.winning = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(g.id), 2) +
                                     (COALESCE(ban_data.banRate, 0) * 1.1) +
                                     (ROUND(SUM(g.kills + g.assists) / SUM(CASE WHEN g.deaths = 0 THEN 1 ELSE g.deaths END), 2) * 0.8)
                                     ) DESC, COUNT(g.id) DESC
                                 ) <= 0.4 THEN 'Tier 2'
                             WHEN PERCENT_RANK() OVER (
                                 ORDER BY (
                                     ROUND(SUM(CASE WHEN g.winning = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(g.id), 2) +
                                     (COALESCE(ban_data.banRate, 0) * 1.1) +
                                     (ROUND(SUM(g.kills + g.assists) / SUM(CASE WHEN g.deaths = 0 THEN 1 ELSE g.deaths END), 2) * 0.8)
                                     ) DESC, COUNT(g.id) DESC
                                 ) <= 0.6 THEN 'Tier 3'
                             WHEN PERCENT_RANK() OVER (
                                 ORDER BY (
                                     ROUND(SUM(CASE WHEN g.winning = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(g.id), 2) +
                                     (COALESCE(ban_data.banRate, 0) * 1.1) +
                                     (ROUND(SUM(g.kills + g.assists) / SUM(CASE WHEN g.deaths = 0 THEN 1 ELSE g.deaths END), 2) * 0.8)
                                     ) DESC, COUNT(g.id) DESC
                                 ) <= 0.8 THEN 'Tier 4'
                             ELSE 'Tier 5'
                             END AS tier
                     FROM game_data g
                              LEFT JOIN (
                         SELECT
                             ban_champion,
                             COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT match_code) FROM ban) AS banRate
                         FROM ban
                         GROUP BY ban_champion
                     ) AS ban_data ON ban_data.ban_champion = g.champion
                     GROUP BY g.champion, ban_data.banRate
                     HAVING COUNT(g.id) >= 3
                 ) AS ranked_data
                     LEFT JOIN (
                SELECT
                    champion,
                    nickname,
                    ROW_NUMBER() OVER (PARTITION BY champion ORDER BY COUNT(id) DESC) AS player_rank
                FROM game_data
                GROUP BY champion, nickname
            ) AS most_player ON most_player.champion = ranked_data.champion AND most_player.player_rank = 1
                     LEFT JOIN (
                SELECT
                    ban_champion,
                    COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT match_code) FROM ban) AS banRate
                FROM ban
                GROUP BY ban_champion
            ) AS ban_data ON ban_data.ban_champion = ranked_data.champion
                     LEFT JOIN champion ch
                               On ch.champion = ranked_data.champion
            ORDER BY
                CASE
                    WHEN ranked_data.tier = 'Tier 1' THEN 1
                    WHEN ranked_data.tier = 'Tier 2' THEN 2
                    WHEN ranked_data.tier = 'Tier 3' THEN 3
                    WHEN ranked_data.tier = 'Tier 4' THEN 4
                    WHEN ranked_data.tier = 'Tier 5' THEN 5
                    END,
                ranked_data.winRate DESC,
                ranked_data.played DESC;
            """, nativeQuery = true)
    List<ChampionStatisticsProjection> findChampionStatistics();


    List<GameData> findByTeamColorAndMatchCode(String teamColor, String matchCode);
    GameData findByNicknameAndMatchCode(String nickname, String matchCode);

    List<GameData> findByMatchCodeIn(List<String> matchCodes);


    @Query(nativeQuery = true, value = """
               WITH ChampionStats AS (
                                    SELECT champion,
                                           position,
                                           SUM(IF(winning = 1, 1, 0)) * 100.0 / COUNT(*) AS winRate,
                                           (SUM(kills) + SUM(assists)) / SUM(deaths) AS kda,
                                           COUNT(*) AS totalGames
                                    FROM game_data
                                    WHERE nickname = :nickname
                                    GROUP BY champion, position
                                )
                                SELECT S.champion AS champion,
                                       C.championEnglish AS championEnglish,
                                       position,
                                       ROUND(winRate, 2) AS winRate,
                                       ROUND(kda, 2) AS kda,
                                       totalGames
                                FROM ChampionStats S
                                         JOIN champion C ON S.champion = C.champion
                                ORDER BY totalGames DESC, winRate DESC
                                LIMIT 6;
           """)
    List<ChampionStatWithEnglishNameProjection> findChampionStatsTop3(@Param("nickname") String nickname);
}
