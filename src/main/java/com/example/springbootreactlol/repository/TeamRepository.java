package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
