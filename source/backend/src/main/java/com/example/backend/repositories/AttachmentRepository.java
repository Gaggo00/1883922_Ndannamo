package com.example.backend.repositories;


import com.example.backend.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    Optional<Attachment> findById(Long id);

    @Query("SELECT a FROM Attachment a WHERE a.event.id = :eventId")
    List<Attachment> findByEventId(Long eventId);

    @Modifying
    @Query(value = "INSERT INTO attachment ( file_data, file_name, file_size, file_type) " +
            "VALUES (cast(:fileData as bytea), :fileName, :fileSize, :fileType) returning id",
            nativeQuery = true)
    Long saveAttachmentNative(
                              @Param("fileData") byte[] fileData,
                              @Param("fileName") String fileName,
                              @Param("fileSize") Long fileSize,
                              @Param("fileType") String fileType);


}
