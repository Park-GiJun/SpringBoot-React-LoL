package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository  extends JpaRepository<TeamMember, Long> {
}
