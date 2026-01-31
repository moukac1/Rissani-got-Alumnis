package com.rissani.connect.service;

import com.rissani.connect.dto.EventRequest;
import com.rissani.connect.dto.EventResponse;
import com.rissani.connect.entity.Event;
import com.rissani.connect.entity.User;
import com.rissani.connect.repository.EventRepository;
import com.rissani.connect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        return EventResponse.fromEntity(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        User currentUser = userService.getCurrentUser();

        Event event = Event.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .date(request.getDate())
                .lieu(request.getLieu())
                .type(Event.TypeEvent.valueOf(request.getType().toUpperCase()))
                .createdBy(currentUser)
                .build();

        Event savedEvent = eventRepository.save(event);
        return EventResponse.fromEntity(savedEvent);
    }

    @Transactional
    public void deleteEvent(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        // Vérifier que l'utilisateur est admin (fait par @PreAuthorize dans le controller)
        eventRepository.delete(event);
    }

    @Transactional
    public void participateToEvent(String eventId) {
        User currentUser = userService.getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        // Vérifier si l'utilisateur participe déjà
        if (event.getParticipants().stream().anyMatch(p -> p.getId().equals(currentUser.getId()))) {
            throw new RuntimeException("Vous participez déjà à cet événement");
        }

        event.getParticipants().add(currentUser);
        eventRepository.save(event);
    }

    @Transactional
    public void cancelParticipation(String eventId) {
        User currentUser = userService.getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        event.getParticipants().removeIf(p -> p.getId().equals(currentUser.getId()));
        eventRepository.save(event);
    }

    public List<EventResponse> getUserEvents(String userId) {
        return eventRepository.findEventsByParticipantId(userId).stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }
}

