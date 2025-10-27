package com.jobportal.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * JPA Entity representing a Resume in the database.
 * Stores resume file metadata and relationship with User entity.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    /** Primary key - auto-generated unique identifier */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Generated filename for storage (UUID-based to avoid conflicts) */
    @Column(nullable = false, length = 255)
    private String fileName;

    /** File type - PDF, DOC, or DOCX */
    @Column(nullable = false, length = 100)
    private String fileType; // PDF, DOC, DOCX

    /** File size in bytes */
    @Column(nullable = false)
    private Long fileSize; // in bytes

    /** Full path where the file is stored on disk */
    @Column(nullable = false, length = 500)
    private String filePath; // path where file is stored

    /** Original filename as uploaded by user */
    @Column(length = 255)
    private String originalFileName;

    /** Flag indicating if this is the user's primary resume */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isPrimary = false;

    /** Optional description provided by user */
    @Column(length = 500)
    private String description;

    /** Many-to-One relationship with User entity */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Timestamp when the resume was created (immutable) */
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    /** Timestamp when the resume was last updated */
    private Instant updatedAt;

    /**
     * JPA callback method executed before persisting a new entity.
     * Sets creation and update timestamps.
     */
    @PrePersist
    public void onCreate() {
        var now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    /**
     * JPA callback method executed before updating an existing entity.
     * Updates the modification timestamp.
     */
    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }
}
