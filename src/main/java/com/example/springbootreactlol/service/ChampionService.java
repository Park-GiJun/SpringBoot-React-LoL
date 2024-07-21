package com.example.springbootreactlol.service;

import com.example.springbootreactlol.projection.ChampionNameProjection;
import com.example.springbootreactlol.repository.ChampionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChampionService {
    private final ChampionRepository championRepository;

    public ChampionService(ChampionRepository championRepository) {
        this.championRepository = championRepository;
    }

    public List<ChampionNameProjection> getAllChampions(String champion) {
        return championRepository.similarChampions(champion);
    }
}
