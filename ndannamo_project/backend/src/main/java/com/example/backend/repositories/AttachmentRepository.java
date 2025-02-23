package com.example.backend.repositories;


import com.example.backend.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    @Query("SELECT a FROM Attachment a WHERE a.event.id = :eventId")
    List<Attachment> findByEventId(Long eventId);

}
