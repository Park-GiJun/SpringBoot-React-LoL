package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueRepository extends JpaRepository<League, Long> {
}
