package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.Champion;
import com.example.springbootreactlol.projection.ChampionNameProjection;
import com.example.springbootreactlol.projection.NicknameProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChampionRepository extends JpaRepository<Champion, Long> {

    @Query(value = "SELECT champion FROM champion WHERE champion.champion LIKE CONCAT('%', :champion, '%') GROUP BY champion", nativeQuery = true)
    List<ChampionNameProjection> similarChampions(@Param("champion") String champion);
}
