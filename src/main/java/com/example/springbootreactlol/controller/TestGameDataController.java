package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.dto.TestGameDataDTO;
import com.example.springbootreactlol.entity.TestGameData;
import com.example.springbootreactlol.service.TestGameDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestGameDataController {

    private final TestGameDataService testGameDataService;

    public TestGameDataController(TestGameDataService testGameDataService) {
        this.testGameDataService = testGameDataService;
    }

    @PostMapping("/public/testSave")
    public ResponseEntity<?> saveMatchData(@RequestBody TestGameDataDTO testGameDataDTO) {
        try {
            testGameDataService.saveMatchData(testGameDataDTO);
            return ResponseEntity.ok("Match data saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving match data: " + e.getMessage());
        }
    }
}
