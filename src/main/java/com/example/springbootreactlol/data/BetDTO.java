package com.example.springbootreactlol.data;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BetDTO {
    String id;
    String leagueMatchData;
    int amount;
    Long selectedLeagueId;
    Long selectedTeamId;
}
