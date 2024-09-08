package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.TestGameData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestGameDataRepository extends JpaRepository<TestGameData, Long> {
}
