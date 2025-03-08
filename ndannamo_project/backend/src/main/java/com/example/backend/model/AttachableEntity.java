package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Collection;
import java.util.Set;

@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "attached_type")
public abstract class AttachableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToMany(mappedBy = "attachedTo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Attachment> attachments;

    public void addAttachment(Attachment attachment) {
        this.getAttachments().add(attachment);
    }

    public void addAttachments(Collection<Attachment> attachments) {
        attachments.forEach(attachment -> attachment.setAttachedTo(this));
        this.getAttachments().addAll(attachments);
    }

}
