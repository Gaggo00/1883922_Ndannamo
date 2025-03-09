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
    @JoinColumn(name="attached_to", foreignKey = @ForeignKey(name = "fk_attachment_attached_to"))
    private AttachableEntity attachedTo;

    @ManyToOne
    private User uploadedBy;

    @ManyToOne
    private Trip trip


}
