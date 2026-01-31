package com.rissani.connect.repository;


import com.rissani.connect.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    List<Event> findByType(Event.TypeEvent type);

    List<Event> findByDateAfter(LocalDateTime date);

    List<Event> findByDateBefore(LocalDateTime date);

    @Query("SELECT e FROM Event e WHERE e.date >= :startDate AND e.date <= :endDate")
    List<Event> findByDateBetween(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.id = :userId")
    List<Event> findEventsByParticipantId(@Param("userId") String userId);
}

