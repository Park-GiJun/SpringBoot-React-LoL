package com.example.springbootreactlol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ban")
public class Ban {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "ban_champion")
    private String banChampion;

    @Column(name = "ban_team_color")
    private String banTeamColor;

    @Column(name = "match_code")
    private String matchCode;

}