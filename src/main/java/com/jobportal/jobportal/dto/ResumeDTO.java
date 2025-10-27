package com.jobportal.jobportal.dto;

import lombok.*;

import java.time.Instant;

/**
 * Data Transfer Object (DTO) for Resume entity.
 * Used for transferring resume data between layers without exposing entity details.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {

    /** Unique identifier for the resume */
    private Long id;
    
    /** Generated filename for storage (UUID-based) */
    private String fileName;
    
    /** File type (PDF, DOC, DOCX) */
    private String fileType;
    
    /** File size in bytes */
    private Long fileSize;
    
    /** Full path where the file is stored on disk */
    private String filePath;
    
    /** Original filename as uploaded by user */
    private String originalFileName;
    
    /** Flag indicating if this is the user's primary resume */
    private Boolean isPrimary;
    
    /** Optional description provided by user */
    private String description;
    
    /** ID of the user who owns this resume */
    private Long userId;
    
    /** Timestamp when the resume was created */
    private Instant createdAt;
    
    /** Timestamp when the resume was last updated */
    private Instant updatedAt;
}
