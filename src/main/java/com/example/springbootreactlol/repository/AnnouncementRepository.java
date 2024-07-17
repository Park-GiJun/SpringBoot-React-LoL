package com.example.springbootreactlol.repository;

import com.example.springbootreactlol.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}
