package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    // TODO: Aggiungere la data di upload del file? limitare lunghezza file? compressione file?
    @Column(columnDefinition = "BYTEA") // Salva il file come blob binario
    private byte[] fileData; // Contenuto del file

    @ManyToOne
    @JoinColumn(name="attached_to", foreignKey = @ForeignKey(name = "fk_attachment_attached_to"))
    private AttachableEntity attachedTo;

    @ManyToOne
    @JoinColumn(name="uploaded_by", foreignKey = @ForeignKey(name = "fk_attachment_uploaded_by"))
    private User uploadedBy;

    @ManyToOne
    @JoinColumn(name="trip_id", foreignKey = @ForeignKey(name = "fk_attachment_trip"))
    private Trip trip;

    private LocalDateTime uploadDate;

    private String description; // Descrizione del file


}
