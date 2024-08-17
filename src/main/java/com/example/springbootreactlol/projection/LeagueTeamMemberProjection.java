package com.example.springbootreactlol.projection;

public interface LeagueTeamMemberProjection {

    Long getLeagueId();
    String getLeagueName();
    String getLeagueDate();
    String getLeagueSeq();
    String getLeagueMatchCode();
    boolean isCheckFinal();
    String getBetDeadLine();

    Long getTeamId();
    String getTeamName();

    Long getMemberId();
    String getPlayerName();
    String getPosition();
}
