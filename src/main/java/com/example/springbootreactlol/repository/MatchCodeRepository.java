package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.MatchCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MatchCodeRepository extends JpaRepository<MatchCode, Long> {
    Optional<MatchCode> findByMatchCode(String matchCode);
}
