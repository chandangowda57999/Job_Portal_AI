package com.jobportal.jobportal.dto;

import lombok.*;

import java.time.Instant;
import java.util.Map;

/**
 * Standardized error response structure for API errors.
 * Provides consistent error information across all endpoints.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    
    /** HTTP status code */
    private int status;
    
    /** Error message */
    private String message;
    
    /** Timestamp when the error occurred */
    private Instant timestamp;
    
    /** Request path where the error occurred */
    private String path;
    
    /** Detailed validation errors (field -> error message) */
    private Map<String, String> errors;
    
    /**
     * Constructor for simple errors without field-specific validation errors.
     */
    public ErrorResponse(int status, String message, String path) {
        this.status = status;
        this.message = message;
        this.path = path;
        this.timestamp = Instant.now();
    }
    
    /**
     * Constructor for validation errors with field-specific messages.
     */
    public ErrorResponse(int status, String message, String path, Map<String, String> errors) {
        this.status = status;
        this.message = message;
        this.path = path;
        this.errors = errors;
        this.timestamp = Instant.now();
    }
}

