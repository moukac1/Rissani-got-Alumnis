package com.rissani.connect.controller;

import com.rissani.connect.dto.EventResponse;
import com.rissani.connect.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping("/{id}/participate")
    public ResponseEntity<Void> participateToEvent(@PathVariable String id) {
        eventService.participateToEvent(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/participate")
    public ResponseEntity<Void> cancelParticipation(@PathVariable String id) {
        eventService.cancelParticipation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventResponse>> getUserEvents(@PathVariable String userId) {
        return ResponseEntity.ok(eventService.getUserEvents(userId));
    }
}
