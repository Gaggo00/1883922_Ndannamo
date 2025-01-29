package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName; // Nome del file originale
    private String fileType; // Tipo MIME (es. "image/png", "application/pdf")
    private Long fileSize;   // Dimensione del file in byte

    @Column(columnDefinition = "BYTEA") // Salva il file come blob binario
    private byte[] fileData; // Contenuto del file

    @ManyToOne
    @JoinColumn(name="event_id", foreignKey = @ForeignKey(name = "fk_attachment_event"))
    private Event event;

}
