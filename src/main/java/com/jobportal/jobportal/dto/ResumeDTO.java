package com.jobportal.jobportal.dto;

import jakarta.validation.constraints.*;
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
    @NotBlank(message = "File name is required")
    private String fileName;
    
    /** File type (PDF, DOC, DOCX) */
    @NotBlank(message = "File type is required")
    @Pattern(regexp = "^(application/pdf|application/msword|application/vnd\\.openxmlformats-officedocument\\.wordprocessingml\\.document)$", 
             message = "File type must be PDF, DOC, or DOCX")
    private String fileType;
    
    /** File size in bytes */
    @NotNull(message = "File size is required")
    @Min(value = 1, message = "File size must be greater than 0")
    @Max(value = 10485760, message = "File size must not exceed 10MB (10485760 bytes)")
    private Long fileSize;
    
    /** Full path where the file is stored on disk */
    @NotBlank(message = "File path is required")
    private String filePath;
    
    /** Original filename as uploaded by user */
    @NotBlank(message = "Original file name is required")
    @Size(max = 255, message = "Original file name must not exceed 255 characters")
    private String originalFileName;
    
    /** Flag indicating if this is the user's primary resume */
    private Boolean isPrimary;
    
    /** Optional description provided by user */
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    /** ID of the user who owns this resume */
    @NotNull(message = "User ID is required")
    private Long userId;
    
    /** Timestamp when the resume was created */
    private Instant createdAt;
    
    /** Timestamp when the resume was last updated */
    private Instant updatedAt;
}
