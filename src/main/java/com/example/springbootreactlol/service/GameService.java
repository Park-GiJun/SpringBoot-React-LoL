package com.example.springbootreactlol.service;

import com.example.springbootreactlol.entity.Ban;
import com.example.springbootreactlol.entity.GameData;
import com.example.springbootreactlol.entity.MatchCode;
import com.example.springbootreactlol.repository.BanRepository;
import com.example.springbootreactlol.repository.GameDataRepository;
import com.example.springbootreactlol.repository.MatchCodeRepository;
import com.example.springbootreactlol.utils.MatchCodeGenerator;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@Transactional
public class GameService {

    private final GameDataRepository gameDataRepository;
    private final BanRepository banRepository;
    private final MatchCodeRepository matchCodeRepository;

    public GameService(GameDataRepository gameDataRepository, BanRepository banRepository, MatchCodeRepository matchCodeRepository) {
        this.gameDataRepository = gameDataRepository;
        this.banRepository = banRepository;
        this.matchCodeRepository = matchCodeRepository;
    }

    public void saveGameData(List<Map<String, Object>> games) {
        for (Map<String, Object> game : games) {
            String matchCode = generateUniqueMatchCode();
            List<Map<String, Object>> gameDataList = (List<Map<String, Object>>) game.get("gameData");
            Integer winning = determineWinningTeam(gameDataList);

            MatchCode matchCodeEntity = new MatchCode();
            matchCodeEntity.setMatchCode(matchCode);
            matchCodeEntity.setWinning(winning);
            matchCodeRepository.save(matchCodeEntity);

            List<GameData> gameDataEntities = gameDataList.stream()
                    .map(dto -> convertToGameDataEntity(dto, matchCode))
                    .collect(Collectors.toList());

            List<Ban> banEntities = ((List<Map<String, Object>>) game.get("banData")).stream()
                    .map(dto -> convertToBanEntity(dto, matchCode))
                    .collect(Collectors.toList());

            gameDataRepository.saveAll(gameDataEntities);
            banRepository.saveAll(banEntities);
        }
    }

    private GameData convertToGameDataEntity(Map<String, Object> dto, String matchCode) {
        GameData gameData = new GameData();
        gameData.setNickname((String) dto.get("nickname"));
        gameData.setChampion((String) dto.get("champion"));
        gameData.setKills((Integer) dto.get("kills"));
        gameData.setDeaths((Integer) dto.get("deaths"));
        gameData.setAssists((Integer) dto.get("assists"));
        gameData.setTeamColor((String) dto.get("teamColor"));
        gameData.setPosition((String) dto.get("position"));
        gameData.setWinning((Integer) dto.get("winning"));
        gameData.setDate(Instant.parse((String) dto.get("date")));
        gameData.setMatchCode(matchCode);
        return gameData;
    }

    private Ban convertToBanEntity(Map<String, Object> dto, String matchCode) {
        Ban ban = new Ban();
        ban.setBanChampion((String) dto.get("champion"));
        ban.setBanTeamColor((String) dto.get("teamColor"));
        ban.setMatchCode(matchCode);
        return ban;
    }

    private Integer determineWinningTeam(List<Map<String, Object>> gameDataList) {
        return (Integer) gameDataList.get(0).get("winning");
    }

    private String generateUniqueMatchCode() {
        String matchCode;
        do {
            matchCode = MatchCodeGenerator.generateMatchCodeWithUUID();
        } while (matchCodeRepository.findByMatchCode(matchCode).isPresent());
        return matchCode;
    }
}