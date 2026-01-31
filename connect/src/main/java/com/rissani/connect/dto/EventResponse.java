package com.rissani.connect.dto;

import com.rissani.connect.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private String id;
    private String titre;
    private String description;
    private LocalDateTime date;
    private String lieu;
    private String type;
    private List<String> participants;
    private String createdBy;
    private LocalDateTime createdAt;

    public static EventResponse fromEntity(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .titre(event.getTitre())
                .description(event.getDescription())
                .date(event.getDate())
                .lieu(event.getLieu())
                .type(event.getType().name().toLowerCase())
                .participants(event.getParticipants().stream()
                        .map(user -> user.getId())
                        .collect(Collectors.toList()))
                .createdBy(event.getCreatedBy().getId())
                .createdAt(event.getCreatedAt())
                .build();
    }
}