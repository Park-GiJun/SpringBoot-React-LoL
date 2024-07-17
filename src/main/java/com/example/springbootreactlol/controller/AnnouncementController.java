package com.example.springbootreactlol.controller;

import com.example.springbootreactlol.entity.Announcement;
import com.example.springbootreactlol.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping("/public/announcement")
    public ResponseEntity<List<Announcement>> publicAnnouncement() {
        return ResponseEntity.ok(announcementService.findAll());
    }
}
