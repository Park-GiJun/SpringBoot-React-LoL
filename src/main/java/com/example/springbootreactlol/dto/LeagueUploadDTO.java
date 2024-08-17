package com.example.springbootreactlol.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LeagueUploadDTO {
    private String leagueName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime betDeadline;
    private int numberOfTeams;

    private List<Team> teams;

    @Data
    public static class Team {
        private String id;
        private String name;
        private List<Member> members;
    }

    @Data
    public static class Member {
        private String name;
        private String position;
    }
}