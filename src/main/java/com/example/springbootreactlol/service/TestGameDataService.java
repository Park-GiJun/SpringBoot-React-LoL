package com.example.springbootreactlol.service;

import com.example.springbootreactlol.dto.ParticipantDTO;
import com.example.springbootreactlol.dto.TestGameDataDTO;
import com.example.springbootreactlol.entity.TestGameData;
import com.example.springbootreactlol.repository.MatchCodeRepository;
import com.example.springbootreactlol.repository.TestGameDataRepository;
import com.example.springbootreactlol.utils.MatchCodeGenerator;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class TestGameDataService {

private final TestGameDataRepository testGameDataRepository;
private final MatchCodeRepository matchCodeRepository;

    public TestGameDataService(TestGameDataRepository testGameDataRepository, MatchCodeRepository matchCodeRepository) {
        this.testGameDataRepository = testGameDataRepository;
        this.matchCodeRepository = matchCodeRepository;
    }


    @Transactional
    public void saveMatchData(TestGameDataDTO testGameDataDTO) {
        String matchCode = generateUniqueMatchCode();

        for (ParticipantDTO participant : testGameDataDTO.getParticipants()) {
            TestGameData gameData = new TestGameData();
            gameData.setGameId(participant.getId());
            gameData.setName(participant.getName());
            gameData.setSkin(participant.getSkin());
            gameData.setTeam(participant.getTeam());
            gameData.setIndividualPosition(participant.getIndividualPosition());
            gameData.setTeamPosition(participant.getTeamPosition());
            gameData.setWin(participant.getWin());

            gameData.setAssists(participant.getAssists());
            gameData.setChampionsKilled(participant.getChampionsKilled());
            gameData.setDoubleKills(participant.getDoubleKills());
            gameData.setTripleKills(participant.getTripleKills());
            gameData.setQuadraKills(participant.getQuadraKills());
            gameData.setNumDeaths(participant.getNumDeaths());
            gameData.setGoldEarned(participant.getGoldEarned());
            gameData.setGoldSpent(participant.getGoldSpent());
            gameData.setLevel(participant.getLevel());
            gameData.setMinionsKilled(participant.getMinionsKilled());
            gameData.setNeutralMinionsKilled(participant.getNeutralMinionsKilled());
            gameData.setTotalDamageDealtToChampions(participant.getTotalDamageDealtToChampions());
            gameData.setTotalDamageTaken(participant.getTotalDamageTaken());
            gameData.setTurretTakedowns(participant.getTurretTakedowns());
            gameData.setDragonKills(participant.getDragonKills());
            gameData.setRiftHeraldKills(participant.getRiftHeraldKills());
            gameData.setVisionScore(participant.getVisionScore());
            gameData.setWardKilled(participant.getWardKilled());
            gameData.setWardPlaced(participant.getWardPlaced());
            gameData.setWardPlacedDetector(participant.getWardPlacedDetector());

            gameData.setItem0(participant.getItem0());
            gameData.setItem1(participant.getItem1());
            gameData.setItem2(participant.getItem2());
            gameData.setItem3(participant.getItem3());
            gameData.setItem4(participant.getItem4());
            gameData.setItem5(participant.getItem5());
            gameData.setItem6(participant.getItem6());

            gameData.setExp(participant.getExp());
            gameData.setHqKilled(participant.getHqKilled());
            gameData.setSightWardsBoughtInGame(participant.getSightWardsBoughtInGame());
            gameData.setVisionWardsBoughtInGame(participant.getVisionWardsBoughtInGame());
            gameData.setMatchCode(matchCode);

            testGameDataRepository.save(gameData);
        }
    }

    private String generateUniqueMatchCode() {
        String matchCode;
        do {
            matchCode = MatchCodeGenerator.generateMatchCodeWithUUID();
        } while (matchCodeRepository.findByMatchCode(matchCode).isPresent());
        return matchCode;
    }
}
