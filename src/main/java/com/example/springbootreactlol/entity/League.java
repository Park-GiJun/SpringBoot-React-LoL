package com.example.springbootreactlol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "league")
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    private String leagueName;

    private String leagueDate;

    private String leagueSeq;

    private String leagueMatchCode;

}
