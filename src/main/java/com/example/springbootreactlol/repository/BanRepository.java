package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.Ban;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BanRepository extends JpaRepository<Ban, Long> {
}
