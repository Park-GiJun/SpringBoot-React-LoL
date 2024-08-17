package com.example.springbootreactlol.projection;

import java.time.Instant;

public interface BetResponseProjection {
    int getBetAmount();
    Instant getBetTime();
    Long getLeagueId();
    String getTeamId();
    String getUserName();
}
